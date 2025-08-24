import Router from "@/router";

export const handleCardClick = (id: number) => {
  Router.push({ path: `/events/${id}` }); // Note the leading slash
};
