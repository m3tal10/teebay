import server from "./app";
import config from "./config";

server.listen({ port: config.port }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
