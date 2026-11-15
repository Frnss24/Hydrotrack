import { supabase } from "../config/supabaseClient.js";

export const CategoryModel = {
  async getAll() {
    const { data, error } = await supabase
      .from("beverage_categories")
      .select("*")
      .order("name", { ascending: true });
    if (error) throw error;
    return data;
  },

  async create(name) {
    const { data, error } = await supabase
      .from("beverage_categories")
      .insert([{ name }])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async remove(id) {
    const { error } = await supabase
      .from("beverage_categories")
      .delete()
      .eq("id", id);
    if (error) throw error;
    return { message: "Category deleted successfully" };
  },
};
