// import { supabase } from "../config/db.js";
// require("dotenv").config();

// export const getProjects = async (req, res) => {
//   try {
//     const { data, error } = await supabase
//       .from("projects")
//       .select("*")
//       .order("created_at", { ascending: false });

//     if (error) throw error;

//     res.json({ success: true, projects: data });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };
