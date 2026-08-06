export const NavigationRoutes = {
  routes: {
    home: ".",
    about: "about.html",
    login: "login.html"
  }
} as const;

export type AppRouteName = keyof typeof NavigationRoutes.routes;
