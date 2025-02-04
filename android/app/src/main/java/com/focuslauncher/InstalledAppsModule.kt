package com.focuslauncher

import android.content.*
import android.content.pm.PackageInfo
import android.content.pm.PackageManager
import android.content.pm.ApplicationInfo
import android.graphics.drawable.BitmapDrawable
import android.util.Base64
import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.drawable.AdaptiveIconDrawable
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import java.io.ByteArrayOutputStream

class InstalledAppsModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    private val packageChangeReceiver = object : BroadcastReceiver() {
        override fun onReceive(context: Context?, intent: Intent?) {
            if (intent?.action == Intent.ACTION_PACKAGE_ADDED || intent?.action == Intent.ACTION_PACKAGE_REMOVED) {
                sendAppListUpdateEvent()
            }
        }
    }

    init {
        val filter = IntentFilter().apply {
            addAction(Intent.ACTION_PACKAGE_ADDED)
            addAction(Intent.ACTION_PACKAGE_REMOVED)
            addDataScheme("package")
        }
        reactContext.registerReceiver(packageChangeReceiver, filter)
    }

    override fun getName(): String {
        return "InstalledApps"
    }

    private fun sendAppListUpdateEvent() {
        reactApplicationContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit("appListUpdated", null)
    }

    @ReactMethod
    fun getInstalledApps(promise: Promise) {
        try {
            val pm: PackageManager = reactApplicationContext.packageManager
            val packages: List<PackageInfo> = pm.getInstalledPackages(0)
            val apps = WritableNativeArray()

            for (packageInfo in packages) {
                packageInfo.applicationInfo?.let { appInfo ->
                    val launchIntent = pm.getLaunchIntentForPackage(packageInfo.packageName)
                    if (launchIntent != null) {
                        val iconBase64 = getAppIconBase64(pm, packageInfo.packageName)

                        val appData = WritableNativeMap().apply {
                            putString("appName", pm.getApplicationLabel(appInfo).toString())
                            putString("packageName", packageInfo.packageName)
                            putString("version", packageInfo.versionName ?: "N/A")
                            putBoolean("isSystemApp", (appInfo.flags and ApplicationInfo.FLAG_SYSTEM) != 0)
                            putString("icon", iconBase64)
                        }
                        apps.pushMap(appData)
                    }
                }
            }

            promise.resolve(apps)
        } catch (e: Exception) {
            promise.reject("GET_APPS_ERROR", "Failed to retrieve installed apps: ${e.message}", e)
        }
    }

    private fun getAppIconBase64(pm: PackageManager, packageName: String): String? {
        return try {
            val drawable = pm.getApplicationIcon(packageName)
            val bitmap = when (drawable) {
                is BitmapDrawable -> drawable.bitmap
                is AdaptiveIconDrawable -> {
                    val bitmap = Bitmap.createBitmap(
                        drawable.intrinsicWidth,
                        drawable.intrinsicHeight,
                        Bitmap.Config.ARGB_8888
                    )
                    val canvas = Canvas(bitmap)
                    drawable.setBounds(0, 0, canvas.width, canvas.height)
                    drawable.draw(canvas)
                    bitmap
                }
                else -> {
                    val bitmap = Bitmap.createBitmap(
                        drawable.intrinsicWidth,
                        drawable.intrinsicHeight,
                        Bitmap.Config.ARGB_8888
                    )
                    val canvas = Canvas(bitmap)
                    drawable.setBounds(0, 0, canvas.width, canvas.height)
                    drawable.draw(canvas)
                    bitmap
                }
            }
            val outputStream = ByteArrayOutputStream()
            bitmap.compress(Bitmap.CompressFormat.PNG, 100, outputStream)
            val byteArray = outputStream.toByteArray()
            Base64.encodeToString(byteArray, Base64.DEFAULT)
        } catch (e: Exception) {
            e.toString()
        }
    }

    @ReactMethod
    fun openApp(packageName: String, promise: Promise) {
    try {
        val launchIntent: Intent? = reactApplicationContext.packageManager.getLaunchIntentForPackage(packageName)
        if (launchIntent != null) {
            launchIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            reactApplicationContext.startActivity(launchIntent)
            promise.resolve("App Opened")
        } else {
            promise.reject("ERROR", "App not found")
        }
    } catch (e: Exception) {
        promise.reject("ERROR", e)
    }
}
}
