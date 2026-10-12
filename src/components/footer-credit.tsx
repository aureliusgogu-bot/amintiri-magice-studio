const CREDIT_LABEL = "webdesign.vale";
const CREDIT_URL = "https://gogu.site/";

/**
 * Discreet web-designer credit shown at the very bottom of every public page
 * (homepage, /recenzii, 404 and error screens). Never rendered inside /admin.
 */
export function FooterCredit() {
  return (
    <p className="footer-credit">
      Site realizat de{" "}
      <a href={CREDIT_URL} target="_blank" rel="noopener">
        {CREDIT_LABEL}
      </a>
    </p>
  );
}
