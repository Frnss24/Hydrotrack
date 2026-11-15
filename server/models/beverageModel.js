import { supabase } from "../config/supabaseClient.js";

export const BeverageModel = {
  async getAll() {
    const { data, error } = await supabase
      .from("beverages")
      .select("*, beverage_categories ( id, name )")
      .order("hydration_index", { ascending: false });
    if (error) throw error;
    return data;
  },

  async getById(id) {
    const { data, error } = await supabase
      .from("beverages")
      .select("*, beverage_categories ( id, name )")
      .eq("id", id)
      .single();
    if (error) throw error;
    return data;
  },

  async create(payload) {
    const { data, error } = await supabase
      .from("beverages")
      .insert([payload])
      .select("*, beverage_categories ( id, name )")
      .single();
    if (error) throw error;
    return data;
  },
};
