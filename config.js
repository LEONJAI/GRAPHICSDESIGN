window.APP_CONFIG = {
  SUPABASE_URL: "https://uxcfhaxcjmwqcmtehvhb.supabase.co",
  SUPABASE_ANON_KEY: "sb_publishable_x33FqWGCLBE8TxZMzO3U7g_NpiJ3Y78",

  // Dollar buttons: paste a Payoneer or Wise payment link when you have one.
PAY_LINKS: {
  logo:   { usd: "https://buy.stripe.com/test_7sY3cx0mLgJHf4q0lM8AE00O", php: "" },
  poster: { usd: "https://buy.stripe.com/test_7sY3cx0mLgJHf4q0lM8AE00", php: "" },
  brand:  { usd: "https://buy.stripe.com/test_7sY3cx0mLgJHf4q0lM8AE00", php: "" }
},
  // Peso buttons open the payment page with these details
  // (unless you add a PayMongo link in "php" above).
  PESO_PAY: {
    gcashName: "LEON JAI",
    gcashNumber: "09161649816",
    mayaName: "",
    mayaNumber: "",
    bankName: "BDO",
    bankAccountName: "LEON JAI",
    bankAccountNumber: "123456789012"
    // qrImage: "images/gcash-qr.png"
  }
};
