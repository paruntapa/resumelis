import Link from "next/link";

export const LogoContainer = () => {
  return (
    <Link href={"/"}>
      <img
        src="/assets/svg/logo.svg"
        alt=""
        className="min-w-10 min-h-10 object-contain"
      />
    </Link>
  );
};
