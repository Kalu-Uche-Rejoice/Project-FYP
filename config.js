const key = {
  type: "service_account",
  project_id: "project-fyp-7017a",
  private_key_id: "a597156c62739c1c94568cb70ed9513c7bfc70de",
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDYugZREDFeBTlR\n0HPCQqcKrfxatZMZAlIz5uTtdMWhUXcN/4NVyK/JSOsDhh+XzK1+7ZQki94nhJXp\nwyLQwFbzUmyjVWBwGQLUfnM5NBgiudvY7hud5f7gJUB5WMGxkTzUP/bpI4li+VmV\nZ3fnj02DKK9KMAnTRmJt2yuWB0AHdEAFNxnIoA8v355LXh1YIZVbbJJ10xGwwXDV\neGfvPi2x4p1eYHFG0fFAJyIjhxl215Tlc2Yyh7vL0MSCGWm2TMXkB5uWXfu5/FKK\nBbUD65D3mFOMGDUxt+R3FJ4i/ORV4OjKn9lyF4MOpX0ETE1jCS5APtHu48SR5NG3\npGTe5w2HAgMBAAECggEADECQBNsuf0s6T1bChJPyD5eAcbxcIYjRDuAZxxbX6WPK\noD72tM3Qqkd2Cc/2T0Wh9VAHFP3XRFKpivqeKEEHaWAahi1Yc13mnA6+AtjgGG57\ncEsdwpJzE0bn2zRaVuiIENPA6LM6nB7OorSjwbKHRkfxiPcoRwpunBlM4IFubD1a\niRgBHHWrk0z3Ntl21phWHsaINqs+VIEWyL2Rv2WQgaiIkHCbuy5VeBSuzJfrePv3\njgmdzpSMsnluvbY2eODeizgxhaAX62h6mqCf7c82Zp7TV0j0Pxjs47uWNDN7rwQ7\ndNFktQMvBzmXuRr2o0YWLFhxJB82E9aiYXOu2b1TwQKBgQD4vyJiNv3Bt1fIR8iD\nejDeZBqskaHQTMjbP9gnfaU4SroWx7UiQWqqJ4KCKW0vEu5fB9aL/SfWv5FMnO50\n6StjNPIdAywXZe8xyrvBxOCIRRqc8RGM4l+zabQhSb+h8H9En0VKTsmp2lMlj3hY\nzll2Jurjdp9kTxPhbJ+5z950JwKBgQDfC91tHuGF2uK7AqOmKXMv8fRX0QVy4WuK\nMgjUPfYbQIfugrBFkc033dUAEfVtrdApFSdmdZvreNuKeNQowUqbRGsNi/dmMZ0x\nHZa/DIY3n/UuwWxCvEv2ad0AsrSYhiN90VUQdQ1PZip6GB9+r9wvmtcKsOa8xuDQ\nx4ZFY7uXoQKBgQCC7xEpQ6sFCf4iBW8NjgclOOo1hh7350Me7ZdZCjEq1WLo1MyK\nsIZ19IAlBatcSQnCafzMCUCsMIBKJJz8WzQkb102WlIeKuDig8WbNIfAEyf0Dozf\nbNVVOkG/9/LwSgij1XaCq8BJMQvtTHzbuhqrL8caXnl+MoXTdfsJstp0pwKBgGGM\nGNz+YndeEUbkkpm7Cwtu8APwAEgL2jJoS4A3UQj+IfTn5xul9nB2bg9Hy2SaXa15\n+O9QhE5pXuqiiXcBghWByKf2DM7+59ZxMFqBqbluFZbLNQPCwh4UknkZru39zEvc\nXy2BY77T2cPoBO4tD0kqmN2uHFt3Rx9IA6sZQRPBAoGANtEmDvW4o9zz86c3zJ+6\nAvMR1lajJsnLvSiU+TQvc9ortZ/0yUAku1QBu7X6ns1RJXY0MrYUapwU9O917+lL\nMb7gc6ANXku6S4jD85X2rbWeMUs+De2DrOrO7+tFcWvhYDP8mixMmOiIXW3gkvMT\n2Z6vpqRQ/AuQq9/VLVViuag=\n-----END PRIVATE KEY-----\n",
  client_email:
    "firebase-adminsdk-fv9eu@project-fyp-7017a.iam.gserviceaccount.com",
  client_id: "105429260680734181154",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fv9eu%40project-fyp-7017a.iam.gserviceaccount.com",
};
const admin = require('firebase-admin/app')
//const firebase=  require("firebase-admin")
exports.app = admin.initializeApp({
    credential: admin.cert(key)
})