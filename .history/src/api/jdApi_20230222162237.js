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
    url: "/?s=App.HongKongImg.SaveInfo",
    method: "post",
    headers: { "content-type": "application/json" },
    timeout: 60000,
    data,
  });
}
