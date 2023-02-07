import { ePage } from "./NoteEnum";

class RoutingUtil {
  static getPageRouting(page: ePage): Record<string, any> {
    const routing = {
      [ePage.eHome]: {
        path: "",
        name: "",
      },
      [ePage.eBack]: {
        path: "",
        name: "",
      },
      [ePage.eNote]: {
        path: "/note",
        name: "NoteView",
      },
    };
    return routing[page];
  }
}

export default RoutingUtil;
