// The manual revalidation endpoints take REVALIDATE_KEY as a bearer token. A
// header keeps the secret out of URLs, which end up in logs and history.
export const isRevalidateAuthorized = (request) => {
  const key = process.env.REVALIDATE_KEY;
  return (
    Boolean(key) && request.headers.get("authorization") === `Bearer ${key}`
  );
};
