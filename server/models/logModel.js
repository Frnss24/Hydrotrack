import { supabase } from "../config/supabaseClient.js";

export const LogModel = {
  async getAll(userIdentifier) {
    let query = supabase
      .from("hydration_logs")
      .select("*")
      .order("consumed_at", { ascending: false });

    if (userIdentifier) {
      query = query.eq("user_identifier", userIdentifier);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async getById(id) {
    const { data, error } = await supabase
      .from("hydration_logs")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    return data;
  },

  async create(payload) {
    const { data, error } = await supabase
      .from("hydration_logs")
      .insert([payload])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id, payload) {
    const { data, error } = await supabase
      .from("hydration_logs")
      .update(payload)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async remove(id) {
    const { error } = await supabase
      .from("hydration_logs")
      .delete()
      .eq("id", id);
    if (error) throw error;
    return { message: "Log deleted successfully" };
  },
};
