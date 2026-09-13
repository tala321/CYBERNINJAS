from datetime import datetime 
 
from sqlalchemy import ( 
    Integer, 
    DateTime, 
    ForeignKey, 
) 
from sqlalchemy.orm import ( 
    Mapped, 
    mapped_column, 
    relationship, 
) 
 
from app.database import Base 
 
 
class UserEquippedItem(Base): 
 
    __tablename__ = "user_equipped_items" 
 
    id: Mapped[int] = mapped_column( 
        Integer, 
        primary_key=True, 
        index=True 
    ) 
 
    user_id: Mapped[int] = mapped_column( 
        ForeignKey( 
            "users.id", 
            ondelete="CASCADE" 
        ), 
        nullable=False 
    ) 
 
    item_id: Mapped[int] = mapped_column( 
        ForeignKey( 
            "avatar_items.id", 
            ondelete="CASCADE" 
        ), 
        nullable=False 
    ) 
 
    equipped_at: Mapped[datetime] = mapped_column( 
        DateTime, 
        default=datetime.utcnow, 
        nullable=False 
    ) 
 
    user = relationship( 
        "User", 
        back_populates="equipped_items" 
    ) 
 
    item = relationship( 
        "AvatarItem", 
        back_populates="equipped_items" 
    ) 
