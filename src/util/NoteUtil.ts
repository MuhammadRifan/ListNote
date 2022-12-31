import type { Router } from "vue-router";
import { ePage } from "./enum";
import RoutingUtil from "./RoutingUtil";

class NoteUtil {
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

  static month(num: number, short?: boolean): string {
    if (num == 0) return short ? "Jan" : "January";
    else if (num == 1) return short ? "Feb" : "February";
    else if (num == 2) return short ? "Mar" : "March";
    else if (num == 3) return short ? "Apr" : "April";
    else if (num == 4) return short ? "May" : "May";
    else if (num == 5) return short ? "June" : "June";
    else if (num == 6) return short ? "July" : "July";
    else if (num == 7) return short ? "Aug" : "August";
    else if (num == 8) return short ? "Sep" : "September";
    else if (num == 9) return short ? "Oct" : "October";
    else if (num == 10) return short ? "Nov" : "November";
    else if (num == 11) return short ? "Dec" : "December";
    else return "";
  }
}

export default NoteUtil;
