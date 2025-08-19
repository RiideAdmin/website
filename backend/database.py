from motor.motor_asyncio import AsyncIOMotorClient
from typing import Optional, List, Dict, Any
import os
from datetime import datetime, date
import json
from bson import ObjectId

class Database:
    def __init__(self):
        self.client: Optional[AsyncIOMotorClient] = None
        self.db = None

    async def connect(self):
        mongo_url = os.environ['MONGO_URL']
        db_name = os.environ.get('DB_NAME', 'riide_dapp')
        
        self.client = AsyncIOMotorClient(mongo_url)
        self.db = self.client[db_name]
        
        # Test connection
        await self.client.admin.command('ping')
        print(f"Connected to MongoDB: {db_name}")

    async def close(self):
        if self.client:
            self.client.close()

    def serialize_datetime(self, obj):
        """Convert datetime objects to ISO format for JSON serialization"""
        if isinstance(obj, (datetime, date)):
            return obj.isoformat()
        elif isinstance(obj, dict):
            return {k: self.serialize_datetime(v) for k, v in obj.items()}
        elif isinstance(obj, list):
            return [self.serialize_datetime(item) for item in obj]
        return obj

    def prepare_document(self, doc: Dict[str, Any]) -> Dict[str, Any]:
        """Prepare document for MongoDB insertion"""
        if doc is None:
            return {}
        
        # Convert datetime objects
        doc = self.serialize_datetime(doc)
        
        # Remove None values
        return {k: v for k, v in doc.items() if v is not None}

    # Generic CRUD operations
    async def create_document(self, collection: str, document: Dict[str, Any]) -> str:
        """Create a new document and return its ID"""
        doc = self.prepare_document(document)
        result = await self.db[collection].insert_one(doc)
        return document.get('id', str(result.inserted_id))

    async def get_document(self, collection: str, document_id: str) -> Optional[Dict[str, Any]]:
        """Get document by ID"""
        doc = await self.db[collection].find_one({"id": document_id})
        if doc:
            doc.pop('_id', None)  # Remove MongoDB ObjectId
        return doc

    async def update_document(self, collection: str, document_id: str, updates: Dict[str, Any]) -> bool:
        """Update document by ID"""
        updates = self.prepare_document(updates)
        updates['updated_at'] = datetime.utcnow().isoformat()
        
        result = await self.db[collection].update_one(
            {"id": document_id},
            {"$set": updates}
        )
        return result.modified_count > 0

    async def delete_document(self, collection: str, document_id: str) -> bool:
        """Delete document by ID"""
        result = await self.db[collection].delete_one({"id": document_id})
        return result.deleted_count > 0

    async def find_documents(self, collection: str, filter_dict: Dict[str, Any] = None, 
                           limit: int = 100, skip: int = 0, sort: List[tuple] = None) -> List[Dict[str, Any]]:
        """Find documents with optional filtering, pagination, and sorting"""
        filter_dict = filter_dict or {}
        
        cursor = self.db[collection].find(filter_dict)
        
        if sort:
            cursor = cursor.sort(sort)
        
        cursor = cursor.skip(skip).limit(limit)
        
        documents = []
        async for doc in cursor:
            doc.pop('_id', None)  # Remove MongoDB ObjectId
            documents.append(doc)
        
        return documents

    async def count_documents(self, collection: str, filter_dict: Dict[str, Any] = None) -> int:
        """Count documents matching filter"""
        filter_dict = filter_dict or {}
        return await self.db[collection].count_documents(filter_dict)

    # User operations
    async def create_user(self, user_data: Dict[str, Any]) -> str:
        return await self.create_document("users", user_data)

    async def get_user_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        doc = await self.db.users.find_one({"email": email})
        if doc:
            doc.pop('_id', None)
        return doc

    async def get_user_by_id(self, user_id: str) -> Optional[Dict[str, Any]]:
        return await self.get_document("users", user_id)

    # Vehicle operations
    async def get_vehicles_by_category(self, category: str) -> List[Dict[str, Any]]:
        return await self.find_documents("vehicles", {"category": category, "available": True})

    async def get_available_vehicles(self, vehicle_type: str = None) -> List[Dict[str, Any]]:
        filter_dict = {"available": True}
        if vehicle_type:
            filter_dict["type"] = vehicle_type
        return await self.find_documents("vehicles", filter_dict)

    # Booking operations  
    async def get_user_bookings(self, user_id: str) -> List[Dict[str, Any]]:
        return await self.find_documents("bookings", {"user_id": user_id}, 
                                       sort=[("created_at", -1)])

    async def get_driver_bookings(self, driver_id: str, status: str = None) -> List[Dict[str, Any]]:
        filter_dict = {"driver_id": driver_id}
        if status:
            filter_dict["status"] = status
        return await self.find_documents("bookings", filter_dict, 
                                       sort=[("pickup_date", 1), ("pickup_time", 1)])

    # Pricing operations
    async def get_pricing_rules(self) -> List[Dict[str, Any]]:
        return await self.find_documents("pricing_rules")

    async def get_extras(self) -> List[Dict[str, Any]]:
        return await self.find_documents("extras")

    async def validate_promo_code(self, code: str) -> Optional[Dict[str, Any]]:
        now = datetime.utcnow().isoformat()
        doc = await self.db.promo_codes.find_one({
            "code": code,
            "active": True,
            "valid_from": {"$lte": now},
            "valid_to": {"$gte": now},
            "$expr": {"$lt": ["$used_count", "$usage_limit"]}
        })
        if doc:
            doc.pop('_id', None)
        return doc

    async def increment_promo_usage(self, promo_id: str):
        await self.db.promo_codes.update_one(
            {"id": promo_id},
            {"$inc": {"used_count": 1}}
        )

    # Content operations
    async def get_services(self) -> List[Dict[str, Any]]:
        return await self.find_documents("services", sort=[("order", 1)])

    async def get_testimonials(self, approved_only: bool = True) -> List[Dict[str, Any]]:
        filter_dict = {"approved": True} if approved_only else {}
        return await self.find_documents("testimonials", filter_dict, 
                                       sort=[("created_at", -1)])

    async def get_blog_posts(self, published_only: bool = True, limit: int = 10) -> List[Dict[str, Any]]:
        filter_dict = {"published": True} if published_only else {}
        return await self.find_documents("blog_posts", filter_dict, 
                                       limit=limit, sort=[("publish_date", -1)])

    async def get_faqs(self, category: str = None) -> List[Dict[str, Any]]:
        filter_dict = {"category": category} if category else {}
        return await self.find_documents("faqs", filter_dict, sort=[("order", 1)])

    # Driver operations
    async def get_driver_by_user_id(self, user_id: str) -> Optional[Dict[str, Any]]:
        doc = await self.db.drivers.find_one({"user_id": user_id})
        if doc:
            doc.pop('_id', None)
        return doc

    async def get_available_drivers(self, location: str = None) -> List[Dict[str, Any]]:
        filter_dict = {"status": "online"}
        return await self.find_documents("drivers", filter_dict)

    # Rewards operations
    async def get_user_reward_balance(self, user_id: str) -> float:
        pipeline = [
            {"$match": {"user_id": user_id}},
            {"$group": {"_id": None, "total": {"$sum": "$amount"}}}
        ]
        result = await self.db.reward_transactions.aggregate(pipeline).to_list(1)
        return result[0]["total"] if result else 0.0

    async def get_user_reward_history(self, user_id: str) -> List[Dict[str, Any]]:
        return await self.find_documents("reward_transactions", {"user_id": user_id},
                                       sort=[("created_at", -1)])

# Global database instance
db = Database()