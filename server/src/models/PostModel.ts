import { IPost } from './_interfaces/PostsInterfaces';
import mongoose from 'mongoose';

// Définition du schéma de la collection 'posts' dans MongoDB
const PostSchema = new mongoose.Schema<IPost>(
  {
    userId: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      max: 500,
    },
    selectedFile: {
      type: String
    },
    tags: {
      type: [String],
    },
    likes: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true } // Ajout des timestamps pour les dates de création et de mise à jour
);

// Création du modèle basé sur le schéma défini
const PostModel = mongoose.model('Post', PostSchema);

export default PostModel;
