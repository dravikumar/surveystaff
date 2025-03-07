/**
 * Hooks Index
 * 
 * This file exports all custom hooks to make them easily importable.
 */

import { useAuth } from '../contexts/AuthContext';
import { useData } from './useData';
import { useStorage } from './useStorage';

export {
  useAuth,
  useData,
  useStorage
}; 