package com.jarudat

import android.os.Bundle
import com.facebook.react.ReactActivity
import com.facebook.FacebookSdk
import com.facebook.appevents.AppEventsLogger

class MainActivity : ReactActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // เริ่มต้น Facebook SDK โดยใช้ application context
        FacebookSdk.sdkInitialize(application) // ใช้ application แทน this
        AppEventsLogger.activateApp(application) // ใช้ application แทน this
    }

    override fun getMainComponentName(): String? {
        return "jarudat"
    }
}
