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
            val packages: List<PackageInfo> = pm.getInstalledPackages(PackageManager.GET_META_DATA)
            val apps = WritableNativeArray()

            for (packageInfo in packages) {
                // Safely get applicationInfo using the safe call operator
                val applicationInfo = packageInfo.applicationInfo

                // Check if applicationInfo is not null and handle accordingly
                if (applicationInfo != null && applicationInfo.flags and ApplicationInfo.FLAG_SYSTEM == 0) {
                    val appInfo = WritableNativeMap()
                    // Safely access appLabel
                    val appLabel = pm.getApplicationLabel(applicationInfo).toString()
                    appInfo.putString("appName", appLabel)
                    appInfo.putString("packageName", packageInfo.packageName)
                    appInfo.putString("version", packageInfo.versionName ?: "N/A")
                    apps.pushMap(appInfo)
                }
            }

            promise.resolve(apps)
        } catch (e: Exception) {
            promise.reject("ERROR", e)
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
