import type { Router } from "vue-router";
import { ePage } from "./enum";
import RoutingUtil from "./RoutingUtil";

class Util {
  static goPage(page: ePage, routerInstance: Router) {
    if (page === ePage.eBack) {
      routerInstance.back();
      return;
    }

    const routerParams = {
      name: RoutingUtil.getPageRouting(page).name,
    };

    routerInstance.push(routerParams);
  }
}

export default Util;
