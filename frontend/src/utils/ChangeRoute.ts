import Router from "@/router";

export const handleCardClick = (id: number) => {
  Router.push({ path: `/events/${id}` }); // Note the leading slash
};

export const handleCategoryClick = (name: string) => {
  Router.push({ path: `/categories/${name}` });
};
