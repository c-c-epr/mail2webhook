export default {
  async email(message: ForwardableEmailMessage, env: Env, ctx: ExecutionContext) {
    type Email = string;

    const suffix = message.to.split("@")[0].split("+")[1] || "@";

    const rules = (JSON.parse((await env.KV.get(suffix)) || "null") || env.Other_Rules) as {
      suffix_rule: string;
      type: "white" | "black";
      list: Email[];
      forward: Email;
      webhook_url: string;
    };

    const { suffix_rule, type, list, forward, webhook_url } = rules;
    console.log(
      `Suffix: ${suffix}, Suffix Rule: ${suffix_rule}, Type: ${type}, List: ${list}, Forward: ${forward}, Webhook URL: ${webhook_url}`,
    );

    if ((type === "white" && list.includes(message.from)) || (type === "black" && !list.includes(message.from))) {
      if (forward) {
        await message.forward(forward);
      }
      if (webhook_url) {
        await fetch(webhook_url, { method: "POST" });
      }
    } else {
      message.setReject("Email rejected by mail2webhook.");
    }
  },
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const params = new URL(request.url).searchParams;
    const headers = new Headers(request.headers);

    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    if (headers.get("X-API-Key") !== env.KEY) {
      return new Response("Unauthorized", { status: 401 });
    }
    const suffix = params.get("suffix");

    let body = null;
    try {
      body = await request.json();
    } catch (e) {}

    if (!body && suffix) {
      await env.KV.delete(suffix);
      return new Response("Deleted", { status: 200 });
    }

    if (suffix) {
      await env.KV.put(suffix, JSON.stringify(body));
      return new Response("Updated", { status: 200 });
    }
    return new Response("Bad Request", { status: 400 });
  },
};
