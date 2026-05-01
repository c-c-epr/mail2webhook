export default {
  async email(message, env, ctx) {
    console.log(message.from);
    console.log(message.to);
  },
  async fetch(request, env, ctx): Promise<Response> {
    return new Response("Hello World!");
  },
} satisfies ExportedHandler<Env>;
