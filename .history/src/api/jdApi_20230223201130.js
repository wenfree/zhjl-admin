import request from "@/utils/request";

export function checkInfo(data) {
  return request({
    url: "/?s=App.IdcardCheck.qrcode",
    headers: { "content-type": "application/json" },
    method: "post",
    data,
  });
}

export function face(data) {
  return request({
    url: "/?s=App.IdcardCheck.qrcode",
    headers: { "content-type": "application/json" },
    method: "post",
    data,
  });
}

export function SaveInfo(data) {
  return request({
    url: "/?s=App.HongKongImg.SaveInfo",
    method: "post",
    headers: { "content-type": "application/json" },
    timeout: 60000,
    data,
  });
}

export function getCodeImg() {
  return request({
    url: "http://api.okayapi.com/?s=App.Captcha.Create4&return_data=0&cap_type=0&cap_width=140&cap_height=36&app_key=90BB9337D7B1ACC0CA642C5726D227CB&sign=051FAA15A9AA72E84989ECD02E1EA87B",
    method: "get",
  });
}
