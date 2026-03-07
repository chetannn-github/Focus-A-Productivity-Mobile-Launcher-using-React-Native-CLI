package com.focuslauncher

import android.content.Intent
import android.provider.Settings
import android.text.TextUtils
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class ScreenLockModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "ScreenLock"
    }

    private fun isAccessibilityEnabled(): Boolean {
        val expectedComponentName = reactApplicationContext.packageName + "/" + LockAccessibilityService::class.java.name
        val enabledServicesSetting = Settings.Secure.getString(reactApplicationContext.contentResolver, Settings.Secure.ENABLED_ACCESSIBILITY_SERVICES)
        
        if (enabledServicesSetting.isNullOrEmpty()) return false
        
        val colonSplitter = TextUtils.SimpleStringSplitter(':')
        colonSplitter.setString(enabledServicesSetting)
        while (colonSplitter.hasNext()) {
            val componentName = colonSplitter.next()
            if (componentName.equals(expectedComponentName, ignoreCase = true)) {
                return true
            }
        }
        return false
    }

    @ReactMethod
    fun hasPermission(promise: Promise) {
        promise.resolve(isAccessibilityEnabled())
    }

    @ReactMethod
    fun requestPermission() {
        if (!isAccessibilityEnabled()) {
            val intent = Intent(Settings.ACTION_ACCESSIBILITY_SETTINGS)
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            reactApplicationContext.startActivity(intent)
        }
    }

    @ReactMethod
    fun lockDevice() {
        if (isAccessibilityEnabled()) {
            // Call the service to lock the screen smoothly
            LockAccessibilityService.instance?.performLock()
        } else {
            requestPermission()
        }
    }
}