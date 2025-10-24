import db from "../services/db.js";
import path from 'path';

export const productsController = {
  async getProducts(req, res) {
    try {
      const result = await db.query('SELECT * FROM products ORDER BY name');
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ message: 'Error al obtener los productos' });
    }
  },

  async createProduct(req, res) {
    const { name, price, stock, category } = req.body;
    
    try {
      // Obtener la ruta de la imagen si se subió un archivo
      let imagePath = null;
      if (req.file) {
        imagePath = `/uploads/${req.file.filename}`;
      }
      
      const result = await db.query(
        'INSERT INTO products (name, price, stock, category, image) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [name, price, stock, category, imagePath]
      );
      
      res.status(201).json({
        success: true,
        product: result.rows[0],
        message: 'Producto creado exitosamente'
      });
    } catch (error) {
      console.error('Error creating product:', error);
      res.status(500).json({
        success: false,
        message: 'Error al crear el producto'
      });
    }
  },

  async updateProduct(req, res) {
    const { id } = req.params;
    const { name, price, stock, category } = req.body;
    
    try {
      // Obtener la ruta de la imagen si se subió un archivo
      let imagePath = null;
      if (req.file) {
        imagePath = `/uploads/${req.file.filename}`;
      } else {
        // Si no se subió nueva imagen, mantener la existente
        const existingProduct = await db.query('SELECT image FROM products WHERE id = $1', [id]);
        if (existingProduct.rows.length > 0) {
          imagePath = existingProduct.rows[0].image;
        }
      }
      
      const result = await db.query(
        'UPDATE products SET name = $1, price = $2, stock = $3, category = $4, image = $5, updated_at = NOW() WHERE id = $6 RETURNING *',
        [name, price, stock, category, imagePath, id]
      );
      
      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Producto no encontrado'
        });
      }
      
      res.json({
        success: true,
        product: result.rows[0],
        message: 'Producto actualizado exitosamente'
      });
    } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).json({
        success: false,
        message: 'Error al actualizar el producto'
      });
    }
  },

  async deleteProduct(req, res) {
    const { id } = req.params;
    
    try {
      const result = await db.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Producto no encontrado'
        });
      }
      
      res.json({
        success: true,
        message: 'Producto eliminado exitosamente'
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      res.status(500).json({
        success: false,
        message: 'Error al eliminar el producto'
      });
    }
  }
};