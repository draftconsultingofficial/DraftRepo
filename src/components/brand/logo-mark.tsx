type LogoMarkProps = {
  className?: string;
};

export function LogoMark({ className }: LogoMarkProps) {
  return (
    <svg
      viewBox="0 0 160 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M28 110V64L70 28V50L40 76V122L28 110Z"
        fill="url(#draft-blue-left)"
        stroke="#203754"
        strokeWidth="1.4"
      />
      <path
        d="M58 96V46L98 10V84L58 108V96Z"
        fill="url(#draft-blue-main)"
        stroke="#203754"
        strokeWidth="1.4"
      />
      <path
        d="M74 92V55L84 48V86L74 92Z"
        fill="url(#draft-blue-inner)"
        stroke="#365984"
        strokeWidth="1.1"
      />
      <path
        d="M104 52L142 78L120 92L104 81V52Z"
        fill="url(#draft-silver-top)"
        stroke="#9BA8B8"
        strokeWidth="1.2"
      />
      <path
        d="M40 123H95L137 99V54"
        stroke="url(#draft-outline)"
        strokeWidth="1.5"
      />
      <path
        d="M96 122C119 111 138 102 142 96V118L114 138H54L96 122Z"
        fill="url(#draft-silver-body)"
        stroke="#8E9AAA"
        strokeWidth="1.2"
      />
      <path
        d="M118 94L142 80V118L118 132V94Z"
        fill="url(#draft-silver-edge)"
        stroke="#AAB5C4"
        strokeWidth="1.2"
      />
      <defs>
        <linearGradient id="draft-blue-left" x1="28" y1="123" x2="82" y2="31" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0A2B58" />
          <stop offset="1" stopColor="#2C67AA" />
        </linearGradient>
        <linearGradient id="draft-blue-main" x1="58" y1="112" x2="110" y2="6" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0A2B58" />
          <stop offset="1" stopColor="#2C6EB4" />
        </linearGradient>
        <linearGradient id="draft-blue-inner" x1="74" y1="92" x2="84" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1A4678" />
          <stop offset="1" stopColor="#467FC0" />
        </linearGradient>
        <linearGradient id="draft-silver-top" x1="142" y1="78" x2="105" y2="53" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F7FBFF" />
          <stop offset="1" stopColor="#B5C1CE" />
        </linearGradient>
        <linearGradient id="draft-silver-body" x1="50" y1="140" x2="148" y2="80" gradientUnits="userSpaceOnUse">
          <stop stopColor="#44556C" />
          <stop offset="0.5" stopColor="#9AA9BA" />
          <stop offset="1" stopColor="#E8EEF7" />
        </linearGradient>
        <linearGradient id="draft-silver-edge" x1="118" y1="107" x2="142" y2="107" gradientUnits="userSpaceOnUse">
          <stop stopColor="#8796A8" />
          <stop offset="0.45" stopColor="#F9FBFF" />
          <stop offset="1" stopColor="#ADBACA" />
        </linearGradient>
        <linearGradient id="draft-outline" x1="40" y1="123" x2="137" y2="54" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2A476D" />
          <stop offset="1" stopColor="#C6D1DC" />
        </linearGradient>
      </defs>
    </svg>
  );
}
