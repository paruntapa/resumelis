import axios from "axios";

export const getRelevantJobs = async (jobtitle: string) => {
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `https://remotive.com/api/remote-jobs?search=${jobtitle}&limit=15`,
    headers: {
      accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
      "accept-language": "en-US,en;q=0.6",
      priority: "u=0, i",
      "sec-ch-ua": '"Chromium";v="134", "Not:A-Brand";v="24", "Brave";v="134"',
      "sec-ch-ua-arch": '"x86"',
      "sec-ch-ua-bitness": '"64"',
      "sec-ch-ua-full-version-list":
        '"Chromium";v="134.0.0.0", "Not:A-Brand";v="24.0.0.0", "Brave";v="134.0.0.0"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-model": '""',
      "sec-ch-ua-platform": '"Windows"',
      "sec-ch-ua-platform-version": '"10.0.0"',
      "sec-fetch-dest": "document",
      "sec-fetch-mode": "navigate",
      "sec-fetch-site": "none",
      "sec-fetch-user": "?1",
      "sec-gpc": "1",
      "upgrade-insecure-requests": "1",
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36",
      Cookie:
        "cf_clearance=29WYuk32tJc5cAOHMLNtKzBmVzEunEtU055uFCBZmRY-1742898481-1.2.1.1-4xKU3yFdI9UVsGn_GXPnCPDot7Gng934hynCc3fMQB0e7KM9YiT7ObTx4Z5LtnwW9I7Wjcyemea86v2F5ePOwnaqKU4F1rWEx0kccxrILe3k7MrOMD51qx3rNtQdTfhI9jJDJJqrvZOKejbjfMMGyFAOUhLqkJP8jxiUVVeu5iVVpvyN3FSf_.3yA1qn4QZiI_65SV.EMvyTVYAzxYU63uW3cRKUI_6.UBNLnPSBlJdHVUngw2stUgnbk2Ajp3Qcl.ADfzG_H7A8wGqtHvXjifWTTCh_kABpA_KfdhKvVcEbaCOWpGHvSGrhH43_Dr_NmAlG9wYUwMaGtPDW9Mb8c4ZllNNJE1SUrP2lpsKFKPQJtrHgH3QxkfEA9tRb0J2lrOw.GlwdF6XWcMFpjL.FleR.vcbANO0bSBXg0tvsgn0; frontend_lang=en_US; session_id=8d0510c04c3f1907b326e933f417fa3bbe256228",
    },
  };

  const response = await axios.request(config)

  return response.data;
};

