import express from "express";
import userRoutes from "./routers/user.route";
import habitRoutes from "./routers/habit.route";

import userSwaggerRoute from "./swagger/user.swagger";

import { requestLogger } from "./middleware/logger.middleware";

const app = express();
app.use(express.json());
app.use(requestLogger);

app.use("/users", userRoutes);
app.use("/habits", habitRoutes);

app.use("/api-docs/users", userSwaggerRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
