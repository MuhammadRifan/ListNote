import router from "@/router";
class Util {
  static goBack() {
    router.back();
  }

  static goPage(name: string) {
    router.push(name);
  }
}

export default Util;
