import { inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  plugins: [
    inferAdditionalFields({
      user: {
        firstName: { type: "string", required: true, input: true },
        lastName: { type: "string", required: true, input: true },
        studentId: { type: "number", required: false, input: true },
        major: { type: "string", required: false, input: true },
        role: {
          type: "string",
          required: false,
          defaultValue: "UNVERIFIED",
          input: false,
        },
      }, 
    }),
  ],
});
