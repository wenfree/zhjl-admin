import request from "@/utils/request";

export function SaveImg(data) {
  return request({
    url: "/?s=App.HongKongImg.SaveImg",
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
    url: "http://api.okayapi.com/?s=App.Captcha.Create4&return_data=0&cap_type=0&cap_width=150&cap_height=40&app_key=90BB9337D7B1ACC0CA642C5726D227CB&sign=051FAA15A9AA72E84989ECD02E1EA87B",
    method: "post",
    headers: { "content-type": "application/json" },
    timeout: 60000,
    data,
  });
}
