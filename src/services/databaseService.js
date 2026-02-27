import { supabase } from '../lib/supabase'

/**
 * Database Service
 * Centraliza as operações de CRUD no Supabase
 */
export const db = {
    /**
     * Busca todos os itens de uma tabela
     */
    async getAll(table) {
        const { data, error } = await supabase
            .from(table)
            .select('*')

        if (error) throw error
        return data
    },

    /**
     * Busca um item específico pelo ID
     */
    async getById(table, id) {
        const { data, error } = await supabase
            .from(table)
            .select('*')
            .eq('id', id)
            .single()

        if (error) throw error
        return data
    },

    /**
     * Insere um novo item
     */
    async insert(table, item) {
        const { data, error } = await supabase
            .from(table)
            .insert([item])
            .select()

        if (error) throw error
        return data[0]
    },

    /**
     * Atualiza um item
     */
    async update(table, id, updates) {
        const { data, error } = await supabase
            .from(table)
            .update(updates)
            .eq('id', id)
            .select()

        if (error) throw error
        return data[0]
    },

    /**
     * Remove um item
     */
    async delete(table, id) {
        const { error } = await supabase
            .from(table)
            .delete()
            .eq('id', id)

        if (error) throw error
        return true
    }
}
