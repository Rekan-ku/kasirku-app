#!/usr/bin/env node
// Kasirku - pembungkus aplikasi native (Capacitor) untuk Android dan iOS.
// Pakai:  node setup.mjs android   |   node setup.mjs ios   [--build]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = path.dirname(fileURLToPath(import.meta.url));
process.chdir(root);
const platform = process.argv[2];
const wantBuild = process.argv.includes('--build');
if (!['android', 'ios'].includes(platform)) {
  console.log('Pakai:  node setup.mjs android   atau   node setup.mjs ios');
  process.exit(1);
}
if (platform === 'ios' && process.platform !== 'darwin') {
  console.error('iOS hanya bisa dibangun di Mac (butuh Xcode). Jalankan perintah ini di Mac.');
  process.exit(1);
}
const run = (cmd, args) => {
  console.log('\n> ' + [cmd, ...args].join(' '));
  const r = spawnSync(cmd, args, { stdio: 'inherit', shell: process.platform === 'win32' });
  if (r.status !== 0) { console.error('\nGagal: ' + cmd + ' ' + args.join(' ')); process.exit(r.status || 1); }
};
const must = (text, from, to, label) => {
  if (!text.includes(from)) { console.error('Patch gagal (bagian tidak ditemukan): ' + label); process.exit(1); }
  return text.replace(from, () => to);
};

/* 1. Siapkan folder www dari src, dengan penyesuaian untuk aplikasi native */
fs.rmSync('www', { recursive: true, force: true });
fs.mkdirSync('www');
for (const f of fs.readdirSync('src')) fs.copyFileSync(path.join('src', f), path.join('www', f));
let html = fs.readFileSync('www/index.html', 'utf8');

html = must(html,
  "function saveFile(name,data,type){\n  const b=new Blob([data],{type});",
  `const isNative=()=>!!(window.Capacitor&&window.Capacitor.isNativePlatform&&window.Capacitor.isNativePlatform());
const _plug={};const plug=n=>_plug[n]||(_plug[n]=window.Capacitor.registerPlugin(n));
async function nativeSave(name,data,type){
  try{
    const blob=data instanceof Blob?data:new Blob([data],{type});
    const b64=await new Promise((ok,no)=>{const r=new FileReader();r.onload=()=>ok(String(r.result).split(',')[1]);r.onerror=no;r.readAsDataURL(blob);});
    const f=await plug('Filesystem').writeFile({path:name,data:b64,directory:'CACHE'});
    await plug('Share').share({title:name,url:f.uri,dialogTitle:'Simpan atau bagikan '+name});
  }catch(e){const m=String((e&&e.message)||e);if(!/cancel|dismiss/i.test(m))toast('Gagal menyimpan: '+m);}
}
function saveFile(name,data,type){
  if(isNative()){nativeSave(name,data,type);return;}
  const b=new Blob([data],{type});`, 'saveFile');

html = must(html,
  "  window.print();\n}\nasync function copyReceipt",
  `  if(isNative()){
    if(window.KasirNative&&window.KasirNative.print){window.KasirNative.print();return;}
    try{plug('KasirPrint').print().catch(e=>toast('Gagal mencetak: '+((e&&e.message)||e)));return;}catch(e){}
  }
  window.print();
}
async function copyReceipt`, 'doPrint');

html = must(html,
  "if('serviceWorker' in navigator){",
  "if('serviceWorker' in navigator&&!(window.Capacitor&&window.Capacitor.isNativePlatform&&window.Capacitor.isNativePlatform())){", 'service worker');
html = must(html,
  'Dialog cetak akan terbuka. Pilih printer AirPrint Anda, lalu tekan Cetak.',
  'Dialog cetak akan terbuka. Pilih printer Anda, lalu tekan Cetak.', 'teks bantuan');
fs.writeFileSync('www/index.html', html);
fs.rmSync('www/sw.js', { force: true });
console.log('OK  www/ siap');

/* 2. Pasang Capacitor */
if (!fs.existsSync('package.json'))
  fs.writeFileSync('package.json', JSON.stringify({ name: 'kasirku-app', version: '1.0.0', private: true }, null, 2));
run('npm', ['install', '@capacitor/core', '@capacitor/cli', '@capacitor/filesystem', '@capacitor/share', '@capacitor-community/bluetooth-le', '@capacitor/' + platform]);
run('npm', ['install', '--save-dev', 'esbuild']);
/* Bluetooth: bungkus BleClient resmi menjadi satu berkas www/ble.js */
fs.writeFileSync('ble-entry.js', "import { BleClient } from '@capacitor-community/bluetooth-le';\nwindow.KasirBle = BleClient;\n");
run('npx', ['esbuild', 'ble-entry.js', '--bundle', '--format=iife', '--minify', '--outfile=www/ble.js']);
fs.rmSync('ble-entry.js', { force: true });
{
  let h2 = fs.readFileSync('www/index.html', 'utf8');
  h2 = must(h2, '</head>', '<script src="ble.js"></script></head>', 'ble.js');
  fs.writeFileSync('www/index.html', h2);
}
const pmArgs = platform === 'ios' && process.env.KASIR_IOS_PM === 'cocoapods' ? ['--packagemanager', 'cocoapods'] : [];
if (!fs.existsSync(platform)) run('npx', ['cap', 'add', platform, ...pmArgs]);

/* 3. Kode native untuk cetak */
if (platform === 'android') {
  const dir = 'android/app/src/main/java/id/kasirku/app';
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'MainActivity.java'), `package id.kasirku.app;

import android.os.Bundle;
import android.print.PrintAttributes;
import android.print.PrintManager;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    final WebView wv = getBridge().getWebView();
    wv.addJavascriptInterface(new Object() {
      @JavascriptInterface
      public void print() {
        runOnUiThread(new Runnable() {
          @Override public void run() {
            PrintManager pm = (PrintManager) getSystemService(PRINT_SERVICE);
            pm.print("Struk Kasirku", wv.createPrintDocumentAdapter("Struk Kasirku"),
                     new PrintAttributes.Builder().build());
          }
        });
      }
    }, "KasirNative");
  }
}
`);
  console.log('OK  android MainActivity (cetak) dipasang');
  const mf = 'android/app/src/main/AndroidManifest.xml';
  let m = fs.readFileSync(mf, 'utf8');
  if (!m.includes('BLUETOOTH_SCAN')) {
    if (!m.includes('xmlns:tools=')) m = must(m, '<manifest ', '<manifest xmlns:tools="http://schemas.android.com/tools" ', 'manifest tools');
    m = must(m, '<application', `<uses-permission android:name="android.permission.BLUETOOTH" android:maxSdkVersion="30" />
    <uses-permission android:name="android.permission.BLUETOOTH_ADMIN" android:maxSdkVersion="30" />
    <uses-permission android:name="android.permission.BLUETOOTH_SCAN" android:usesPermissionFlags="neverForLocation" tools:targetApi="s" />
    <uses-permission android:name="android.permission.BLUETOOTH_CONNECT" />
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" android:maxSdkVersion="30" />
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" android:maxSdkVersion="30" />
    <uses-feature android:name="android.hardware.bluetooth_le" android:required="false" />
    <application`, 'manifest izin');
    fs.writeFileSync(mf, m);
  }
  console.log('OK  izin Bluetooth Android dipasang');
} else {
  try { /* ikon aplikasi */
    const set = 'ios/App/App/Assets.xcassets/AppIcon.appiconset';
    const c = JSON.parse(fs.readFileSync(path.join(set, 'Contents.json'), 'utf8'));
    const f = (c.images || []).map(i => i.filename).find(Boolean);
    if (f) { fs.copyFileSync('src/icon-1024.png', path.join(set, f)); console.log('OK  ikon iOS dipasang'); }
  } catch (e) { console.log('Peringatan: ikon bawaan dipakai (' + e.message + ')'); }
  const ad = 'ios/App/App/AppDelegate.swift';
  let sw = fs.readFileSync(ad, 'utf8');
  if (!sw.includes('KasirPrintPlugin')) {
    sw = 'import WebKit\n' + sw + `

@objc(KasirPrintPlugin)
public class KasirPrintPlugin: CAPPlugin, CAPBridgedPlugin {
  public let identifier = "KasirPrintPlugin"
  public let jsName = "KasirPrint"
  public let pluginMethods: [CAPPluginMethod] = [CAPPluginMethod(name: "print", returnType: CAPPluginReturnPromise)]
  @objc func print(_ call: CAPPluginCall) {
    DispatchQueue.main.async {
      guard let web = self.bridge?.webView else { call.reject("WebView tidak tersedia"); return }
      let info = UIPrintInfo(dictionary: nil)
      info.outputType = .general
      info.jobName = "Struk Kasirku"
      let pc = UIPrintInteractionController.shared
      pc.printInfo = info
      pc.printFormatter = web.viewPrintFormatter()
      pc.showsNumberOfCopies = true
      pc.present(from: web.bounds, in: web, animated: true, completionHandler: nil)
      call.resolve()
    }
  }
}

class MainViewController: CAPBridgeViewController {
  override open func capacitorDidLoad() {
    bridge?.registerPluginInstance(KasirPrintPlugin())
  }
}
`;
    fs.writeFileSync(ad, sw);
  }
  const sb = 'ios/App/App/Base.lproj/Main.storyboard';
  let st = fs.readFileSync(sb, 'utf8');
  if (!st.includes('MainViewController')) {
    st = must(st, 'customClass="CAPBridgeViewController" customModule="Capacitor"',
      'customClass="MainViewController" customModule="App" customModuleProvider="target"', 'storyboard');
    fs.writeFileSync(sb, st);
  }
  const pl = 'ios/App/App/Info.plist';
  let pt = fs.readFileSync(pl, 'utf8');
  if (!pt.includes('NSBluetoothAlwaysUsageDescription')) {
    const i = pt.lastIndexOf('</dict>');
    if (i < 0) { console.error('Info.plist tidak dikenali'); process.exit(1); }
    pt = pt.slice(0, i) + '\t<key>NSBluetoothAlwaysUsageDescription</key>\n\t<string>Kasirku memakai Bluetooth untuk mengirim struk ke printer.</string>\n' + pt.slice(i);
    fs.writeFileSync(pl, pt);
  }
  console.log('OK  iOS plugin cetak dan izin Bluetooth dipasang');
}

/* 4. Sinkronkan */
run('npx', ['cap', 'sync', platform]);

if (platform === 'android' && wantBuild) {
  const gw = process.platform === 'win32' ? 'gradlew.bat' : './gradlew';
  const r = spawnSync(gw, ['assembleDebug'], { cwd: 'android', stdio: 'inherit', shell: process.platform === 'win32' });
  if (r.status === 0) console.log('\nSELESAI. APK: android/app/build/outputs/apk/debug/app-debug.apk');
  else console.log('\nBuild otomatis gagal. Buka Android Studio:  npx cap open android  lalu Build > Build APK(s).');
} else {
  console.log('\nSELESAI. Langkah berikutnya: npx cap open ' + platform);
}
