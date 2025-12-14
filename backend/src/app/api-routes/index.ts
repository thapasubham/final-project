import { downloadRouter } from "./download.route";
import { fontRoute } from "./font.routes";
import { langRoute } from "./lang.routes";
import { payment } from "./payment.routes";
import { permissionRoutes } from "./permission.route";
import { rolesRoutes } from "./roles.route";
import { userRouter } from "./user.route";

export default {
  fontRoute,
  langRoute,
  payment,
  userRouter,
  permissionRoutes,
  downloadRouter,
  rolesRoutes,
};
