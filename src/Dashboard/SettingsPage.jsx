import React, { useState } from "react";
import {
  Store,
  Phone,
  Mail,
  Settings as SettingsIcon,
  Bell,
  ShieldCheck,
  CloudOff,
  Save,
  LockKeyhole,
  Sparkles,
} from "lucide-react";

/* -------------------------------------------------------
   Premium Field
------------------------------------------------------- */

function Field({
  label,
  value,
  onChange,
  icon: Icon,
  help,
  type = "text",
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-[12px] font-medium text-[#5C5548]">
        {label}
      </label>

      <div
        className="
          group flex items-center gap-3
          h-[52px]
          rounded-xl
          border border-[#E8E1D5]
          bg-[#FFFEFC]
          px-4
          transition-all duration-200
          hover:border-[#D7CCBA]
          focus-within:border-[#1F3D2C]
          focus-within:ring-4
          focus-within:ring-[#1F3D2C]/5
        "
      >
        <Icon
          size={17}
          strokeWidth={1.8}
          className="
            shrink-0
            text-[#9A9284]
            transition-colors
            group-focus-within:text-[#1F3D2C]
          "
        />

        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="
            w-full
            bg-transparent
            outline-none
            text-[14px]
            text-[#2B2620]
            placeholder:text-[#B0A89C]
          "
        />
      </div>

      {help && (
        <p className="text-[11px] leading-4 text-[#9A9284]">
          {help}
        </p>
      )}
    </div>
  );
}

/* -------------------------------------------------------
   Premium Toggle
------------------------------------------------------- */

function Toggle({
  label,
  sub,
  checked,
  onChange,
  icon: Icon,
  iconBg,
  iconFg,
}) {
  return (
    <div className="flex items-center justify-between gap-5 py-5">
      <div className="flex items-center gap-4 min-w-0">
        <div
          className="
            w-10 h-10
            rounded-full
            flex items-center justify-center
            shrink-0
          "
          style={{ background: iconBg }}
        >
          <Icon
            size={17}
            strokeWidth={1.8}
            style={{ color: iconFg }}
          />
        </div>

        <div className="min-w-0">
          <div className="text-[14px] font-medium text-[#2B2620]">
            {label}
          </div>

          <div className="text-[12px] text-[#8A8477] mt-0.5">
            {sub}
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onChange(!checked)}
        aria-pressed={checked}
        className={`
          relative
          w-[48px] h-[27px]
          rounded-full
          shrink-0
          transition-all duration-200
          ${
            checked
              ? "bg-[#163B29]"
              : "bg-[#D9D3C8]"
          }
        `}
      >
        <span
          className={`
            absolute
            top-[3px]
            w-[21px]
            h-[21px]
            rounded-full
            bg-white
            shadow-[0_2px_5px_rgba(0,0,0,0.15)]
            transition-transform duration-200
            ${
              checked
                ? "translate-x-[24px]"
                : "translate-x-[3px]"
            }
          `}
        />
      </button>
    </div>
  );
}

/* -------------------------------------------------------
   Section Header
------------------------------------------------------- */

function SectionHeader({
  icon: Icon,
  title,
  description,
}) {
  return (
    <div className="flex items-start gap-4 mb-7">
      <div
        className="
          w-11 h-11
          rounded-full
          bg-[#EEF4ED]
          flex items-center justify-center
          shrink-0
        "
      >
        <Icon
          size={19}
          strokeWidth={1.8}
          className="text-[#1F3D2C]"
        />
      </div>

      <div>
        <h2 className="text-[16px] font-semibold text-[#2B2620]">
          {title}
        </h2>

        <p className="text-[12px] text-[#8A8477] mt-1 leading-5">
          {description}
        </p>
      </div>
    </div>
  );
}

/* -------------------------------------------------------
   Settings Page
------------------------------------------------------- */

export default function SettingsPage() {
  const [storeName, setStoreName] =
    useState("Survaya Naturals");

  const [storePhone, setStorePhone] =
    useState("9876543210");

  const [storeEmail, setStoreEmail] =
    useState("hello@survayanaturals.com");

  const [autoConfirm, setAutoConfirm] =
    useState(true);

  const [soundAlert, setSoundAlert] =
    useState(false);

  return (
    <main
      className="
        flex-1
        min-w-0
        overflow-auto
        bg-[#FAF7F2]
        text-[#2B2620]
      "
    >
      {/* =================================================
          HEADER
      ================================================= */}

      <header
        className="
          px-6
          md:px-8
          pt-7
          pb-5
          flex
          items-start
          justify-between
          gap-5
          flex-wrap
        "
      >
        {/* Heading */}

        <div>
          <div className="flex items-center gap-2">
            <h1
              className="
                text-[28px]
                md:text-[30px]
                font-serif
                text-[#173B29]
                tracking-[-0.3px]
              "
            >
              Settings
            </h1>

            <Sparkles
              size={17}
              className="text-[#C9A227] mt-1"
            />
          </div>

          <p
            className="
              text-[12px]
              text-[#8A8477]
              mt-1.5
              max-w-[570px]
              leading-5
            "
          >
            Manage your store details, notifications,
            and order preferences.
          </p>
        </div>

        {/* Connection Status */}

        <div
          className="
            flex
            items-center
            gap-3
            rounded-2xl
            border border-[#F0D9BD]
            bg-[#FFF5E9]
            px-4
            py-3
            min-w-[280px]
          "
        >
          <div
            className="
              w-10 h-10
              rounded-full
              bg-[#FFE8D0]
              flex
              items-center
              justify-center
              shrink-0
            "
          >
            <CloudOff
              size={18}
              className="text-[#C46A2E]"
            />
          </div>

          <div>
            <div className="text-[13px] font-semibold text-[#C46A2E]">
              Not Connected
            </div>

            <div className="text-[11px] text-[#9A7B5A] mt-0.5">
              Google Sheet connection required
            </div>
          </div>
        </div>
      </header>

      {/* =================================================
          CONTENT
      ================================================= */}

      <section
        className="
          px-6
          md:px-8
          pb-10
          max-w-[1000px]
          space-y-5
        "
      >
        {/* =================================================
            STORE INFORMATION
        ================================================= */}

        <div
          className="
            bg-white
            rounded-2xl
            border border-[#E8E1D5]
            shadow-[0_2px_10px_rgba(52,42,30,0.025)]
            p-5
            md:p-7
          "
        >
          <SectionHeader
            icon={Store}
            title="Store Information"
            description="Update your store details and how customers can reach you."
          />

          <div className="space-y-5">
            <Field
              label="Store Name"
              value={storeName}
              onChange={setStoreName}
              icon={Store}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field
                label="Store Phone"
                value={storePhone}
                onChange={setStorePhone}
                icon={Phone}
                type="tel"
                help="This number will be visible to your customers."
              />

              <Field
                label="Store Email"
                value={storeEmail}
                onChange={setStoreEmail}
                icon={Mail}
                type="email"
                help="We'll use this email for important updates."
              />
            </div>
          </div>
        </div>

        {/* =================================================
            OTHER SETTINGS
        ================================================= */}

        <div
          className="
            bg-white
            rounded-2xl
            border border-[#E8E1D5]
            shadow-[0_2px_10px_rgba(52,42,30,0.025)]
            p-5
            md:p-7
          "
        >
          <SectionHeader
            icon={SettingsIcon}
            title="Preferences"
            description="Manage order confirmations and notifications."
          />

          <div className="divide-y divide-[#F0EBE3]">
            <Toggle
              label="Automatic order confirmation"
              sub="Automatically confirm orders after payment."
              checked={autoConfirm}
              onChange={setAutoConfirm}
              icon={Mail}
              iconBg="#E8F2EA"
              iconFg="#2F6F4E"
            />

            <Toggle
              label="Sound alert for new orders"
              sub="Play a notification sound when a new order arrives."
              checked={soundAlert}
              onChange={setSoundAlert}
              icon={Bell}
              iconBg="#FFF4D8"
              iconFg="#A27A13"
            />
          </div>
        </div>

        {/* =================================================
            SAVE PANEL
        ================================================= */}

        <div
          className="
            rounded-2xl
            border border-[#E6D7B4]
            bg-gradient-to-r
            from-[#FFF9ED]
            to-[#FBF7EC]
            p-5
            md:p-6
          "
        >
          <div
            className="
              flex
              flex-col
              lg:flex-row
              lg:items-center
              lg:justify-between
              gap-5
            "
          >
            {/* Save information */}

            <div className="flex items-center gap-4">
              <div
                className="
                  w-11 h-11
                  rounded-full
                  bg-[#F0DFA3]
                  flex
                  items-center
                  justify-center
                  shrink-0
                "
              >
                <ShieldCheck
                  size={19}
                  className="text-[#76572B]"
                />
              </div>

              <div>
                <div className="text-[14px] font-semibold text-[#2B2620]">
                  Save your settings
                </div>

                <div className="text-[12px] text-[#8A8477] mt-1">
                  Connect your Google Sheet to persist these changes.
                </div>
              </div>
            </div>

            {/* Save Button */}

            <div className="flex flex-col items-stretch gap-2">
              <button
                type="button"
                disabled
                className="
                  h-[48px]
                  min-w-[250px]
                  flex
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-[#163B29]
                  text-white
                  text-[13px]
                  font-semibold
                  opacity-90
                  cursor-not-allowed
                  shadow-[0_4px_12px_rgba(22,59,41,0.12)]
                "
              >
                <Save size={16} />

                Save Changes
              </button>

              <div
                className="
                  flex
                  items-center
                  justify-center
                  gap-1.5
                  text-[10px]
                  text-[#8A8477]
                "
              >
                <LockKeyhole size={11} />

                Changes are local until connected
              </div>
            </div>
          </div>
        </div>

        {/* =================================================
            TIP
        ================================================= */}

        <div
          className="
            rounded-2xl
            border border-[#E4E5D9]
            bg-[#F8F9F3]
            px-5
            py-4
            flex
            items-start
            gap-3
          "
        >
          <Sparkles
            size={17}
            className="text-[#7A8D52] shrink-0 mt-0.5"
          />

          <p className="text-[11px] text-[#6E705F] leading-5">
            <span className="font-semibold text-[#405232]">
              Tip:
            </span>{" "}
            Once connected, your settings can be saved
            securely and applied across your dashboard.
          </p>
        </div>
      </section>
    </main>
  );
}