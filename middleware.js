import { NextResponse } from "next/server";

const middleware = (request) => {
  return NextResponse.next();
};

export default middleware;
