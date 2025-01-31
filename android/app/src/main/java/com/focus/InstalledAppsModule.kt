package com.focus

import android.content.Intent
import android.content.pm.PackageInfo
import android.content.pm.PackageManager
import android.content.pm.ApplicationInfo
import com.facebook.react.bridge.*

class InstalledAppsModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "InstalledApps"
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

                // App sirf tab add karo jab ye launcher me visible ho
                if (launchIntent != null) {
                    val appData = WritableNativeMap().apply {
                        putString("appName", pm.getApplicationLabel(appInfo).toString())
                        putString("packageName", packageInfo.packageName)
                        putString("version", packageInfo.versionName ?: "N/A")
                        putBoolean("isSystemApp", (appInfo.flags and ApplicationInfo.FLAG_SYSTEM) != 0)
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
