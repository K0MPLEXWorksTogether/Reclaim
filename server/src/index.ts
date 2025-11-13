import express from "express";
import userRoutes from "./routers/user.route";
import habitRoutes from "./routers/habit.route";
import addictionRoutes from "./routers/addiction.route";
import journalRoutes from "./routers/journal.route";

import userSwaggerRoute from "./swagger/user.swagger";
import habitSwaggerRoute from "./swagger/habit.swagger";
import addictionSwaggerRoute from "./swagger/addiction.swagger";
import journalSwaggerRoute from "./swagger/journal.swagger";

import { requestLogger } from "./middleware/logger.middleware";

const app = express();
app.use(express.json());
app.use(requestLogger);

app.use("/users", userRoutes);
app.use("/habits", habitRoutes);
app.use("/addictions", addictionRoutes);
app.use("/journals", journalRoutes);

app.use("/api-docs/users", userSwaggerRoute);
app.use("/api-docs/habits", habitSwaggerRoute);
app.use("/api-docs/addictions", addictionSwaggerRoute);
app.use("/api-docs/journal", journalSwaggerRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
