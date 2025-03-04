from .client import get_supabase_client
from dotenv import load_dotenv
import logging
import os
from rest_framework.exceptions import ValidationError

# Load environment variables from .env file
load_dotenv()

logger = logging.getLogger(__name__)

class SupabaseData:
    """
    Handles data operations with Supabase.
    """
    
    @staticmethod
    def fetch_data(table_name, access_token=None, query_params=None):
        """
        Fetch data from a Supabase table.
        
        Args:
            table_name (str): Name of the table
            access_token (str, optional): User's access token for RLS
            query_params (dict, optional): Query parameters like select, filter, etc.
            
        Returns:
            list: Data from the table
        """
        try:
            supabase = get_supabase_client()
            
            # Set auth token if provided (for RLS)
            if access_token:
                supabase.auth.set_auth(access_token)
            
            # Start building the query
            query = supabase.table(table_name)
            
            # Apply query parameters if provided
            if query_params:
                # Select specific columns
                if 'select' in query_params:
                    query = query.select(query_params['select'])
                
                # Apply filters
                if 'filters' in query_params:
                    for filter_item in query_params['filters']:
                        column = filter_item.get('column')
                        operator = filter_item.get('operator', 'eq')
                        value = filter_item.get('value')
                        
                        if column and value is not None:
                            if operator == 'eq':
                                query = query.eq(column, value)
                            elif operator == 'neq':
                                query = query.neq(column, value)
                            elif operator == 'gt':
                                query = query.gt(column, value)
                            elif operator == 'lt':
                                query = query.lt(column, value)
                            elif operator == 'gte':
                                query = query.gte(column, value)
                            elif operator == 'lte':
                                query = query.lte(column, value)
                            elif operator == 'like':
                                query = query.like(column, value)
                            elif operator == 'ilike':
                                query = query.ilike(column, value)
                            elif operator == 'in':
                                query = query.in_(column, value)
                
                # Apply order
                if 'order' in query_params:
                    for order_item in query_params['order']:
                        column = order_item.get('column')
                        ascending = order_item.get('ascending', True)
                        
                        if column:
                            query = query.order(column, ascending=ascending)
                
                # Apply pagination
                if 'limit' in query_params:
                    query = query.limit(query_params['limit'])
                
                if 'offset' in query_params:
                    query = query.offset(query_params['offset'])
            
            # Execute the query
            response = query.execute()
            
            if response.error:
                logger.error(f"Supabase fetch data error: {response.error}")
                raise ValidationError(response.error.message)
            
            return {
                "success": True,
                "data": response.data
            }
            
        except Exception as e:
            logger.error(f"Error fetching data: {str(e)}")
            raise
    
    @staticmethod
    def insert_data(table_name, data, access_token=None):
        """
        Insert data into a Supabase table.
        
        Args:
            table_name (str): Name of the table
            data (dict or list): Data to insert
            access_token (str, optional): User's access token for RLS
            
        Returns:
            dict: Inserted data
        """
        try:
            supabase = get_supabase_client()
            
            # Set auth token if provided (for RLS)
            if access_token:
                supabase.auth.set_auth(access_token)
            
            response = supabase.table(table_name).insert(data).execute()
            
            if response.error:
                logger.error(f"Supabase insert data error: {response.error}")
                raise ValidationError(response.error.message)
            
            return {
                "success": True,
                "data": response.data
            }
            
        except Exception as e:
            logger.error(f"Error inserting data: {str(e)}")
            raise
    
    @staticmethod
    def update_data(table_name, data, match_column, match_value, access_token=None):
        """
        Update data in a Supabase table.
        
        Args:
            table_name (str): Name of the table
            data (dict): Data to update
            match_column (str): Column to match for the update
            match_value (any): Value to match for the update
            access_token (str, optional): User's access token for RLS
            
        Returns:
            dict: Updated data
        """
        try:
            supabase = get_supabase_client()
            
            # Set auth token if provided (for RLS)
            if access_token:
                supabase.auth.set_auth(access_token)
            
            response = supabase.table(table_name).update(data).eq(match_column, match_value).execute()
            
            if response.error:
                logger.error(f"Supabase update data error: {response.error}")
                raise ValidationError(response.error.message)
            
            return {
                "success": True,
                "data": response.data
            }
            
        except Exception as e:
            logger.error(f"Error updating data: {str(e)}")
            raise
    
    @staticmethod
    def delete_data(table_name, match_column, match_value, access_token=None):
        """
        Delete data from a Supabase table.
        
        Args:
            table_name (str): Name of the table
            match_column (str): Column to match for the delete
            match_value (any): Value to match for the delete
            access_token (str, optional): User's access token for RLS
            
        Returns:
            dict: Deleted data
        """
        try:
            supabase = get_supabase_client()
            
            # Set auth token if provided (for RLS)
            if access_token:
                supabase.auth.set_auth(access_token)
            
            response = supabase.table(table_name).delete().eq(match_column, match_value).execute()
            
            if response.error:
                logger.error(f"Supabase delete data error: {response.error}")
                raise ValidationError(response.error.message)
            
            return {
                "success": True,
                "data": response.data
            }
            
        except Exception as e:
            logger.error(f"Error deleting data: {str(e)}")
            raise
    
    @staticmethod
    def execute_rpc(function_name, params=None, access_token=None):
        """
        Execute a Postgres function (RPC) in Supabase.
        
        Args:
            function_name (str): Name of the function
            params (dict, optional): Parameters for the function
            access_token (str, optional): User's access token for RLS
            
        Returns:
            dict: Result of the function
        """
        try:
            supabase = get_supabase_client()
            
            # Set auth token if provided (for RLS)
            if access_token:
                supabase.auth.set_auth(access_token)
            
            response = supabase.rpc(function_name, params or {}).execute()
            
            if response.error:
                logger.error(f"Supabase RPC error: {response.error}")
                raise ValidationError(response.error.message)
            
            return {
                "success": True,
                "data": response.data
            }
            
        except Exception as e:
            logger.error(f"Error executing RPC: {str(e)}")
            raise 