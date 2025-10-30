import { supabase, BUCKETS } from './supabase';

/**
 * Validates image file before upload
 */
export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  // Check file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Format file tidak didukung. Gunakan JPG, PNG, atau WebP.',
    };
  }

  // Check file size (max 5MB for restaurants, 3MB for menus)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `Ukuran file terlalu besar. Maksimal ${maxSize / (1024 * 1024)}MB.`,
    };
  }

  return { valid: true };
};

/**
 * Generate unique filename
 */
const generateFileName = (prefix: string, originalName: string): string => {
  const timestamp = Date.now();
  const extension = originalName.split('.').pop() || 'jpg';
  return `${prefix}-${timestamp}.${extension}`;
};

/**
 * Upload restaurant image to Supabase Storage
 */
export const uploadRestaurantImage = async (
  file: File,
  restaurantId: string
): Promise<{ success: boolean; url?: string; error?: string }> => {
  try {
    // Validate file
    const validation = validateImageFile(file);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    // Generate filename
    const fileName = generateFileName(`restaurant-${restaurantId}`, file.name);

    // Upload to Supabase
    const { data, error } = await supabase.storage
      .from(BUCKETS.RESTAURANT_IMAGES)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Upload error:', error);
      return { success: false, error: 'Gagal upload gambar. Silakan coba lagi.' };
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(BUCKETS.RESTAURANT_IMAGES)
      .getPublicUrl(data.path);

    return { success: true, url: publicUrl };
  } catch (error) {
    console.error('Upload exception:', error);
    return { success: false, error: 'Terjadi kesalahan saat upload gambar.' };
  }
};

/**
 * Upload menu image to Supabase Storage
 */
export const uploadMenuImage = async (
  file: File,
  menuId: string
): Promise<{ success: boolean; url?: string; error?: string }> => {
  try {
    // Validate file
    const validation = validateImageFile(file);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    // Generate filename
    const fileName = generateFileName(`menu-${menuId}`, file.name);

    // Upload to Supabase
    const { data, error } = await supabase.storage
      .from(BUCKETS.MENU_IMAGES)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Upload error:', error);
      return { success: false, error: 'Gagal upload gambar. Silakan coba lagi.' };
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(BUCKETS.MENU_IMAGES)
      .getPublicUrl(data.path);

    return { success: true, url: publicUrl };
  } catch (error) {
    console.error('Upload exception:', error);
    return { success: false, error: 'Terjadi kesalahan saat upload gambar.' };
  }
};

/**
 * Delete image from Supabase Storage
 */
export const deleteImage = async (
  bucketName: string,
  imageUrl: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    // Extract file path from URL
    // URL format: https://[project].supabase.co/storage/v1/object/public/[bucket]/[path]
    const urlParts = imageUrl.split('/');
    const bucketIndex = urlParts.indexOf(bucketName);
    
    if (bucketIndex === -1) {
      return { success: false, error: 'Invalid image URL' };
    }

    const filePath = urlParts.slice(bucketIndex + 1).join('/');

    // Delete from Supabase
    const { error } = await supabase.storage
      .from(bucketName)
      .remove([filePath]);

    if (error) {
      console.error('Delete error:', error);
      return { success: false, error: 'Gagal menghapus gambar.' };
    }

    return { success: true };
  } catch (error) {
    console.error('Delete exception:', error);
    return { success: false, error: 'Terjadi kesalahan saat menghapus gambar.' };
  }
};

/**
 * Get image URL from file path
 */
export const getImageUrl = (bucketName: string, filePath: string): string => {
  const { data: { publicUrl } } = supabase.storage
    .from(bucketName)
    .getPublicUrl(filePath);
  
  return publicUrl;
};

