import express from "express";
import userRoutes from "./routers/user.route";

import userSwaggerRoute from "./swagger/user.swagger";

const app = express();
app.use(express.json());

app.use("/users", userRoutes);

app.use("/api-docs/users", userSwaggerRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
