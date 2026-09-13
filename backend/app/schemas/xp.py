from datetime import datetime
from typing import Optional, List

from pydantic import BaseModel, ConfigDict


# =====================================================
# CREATE XP
# =====================================================

class XPCreate(BaseModel):

    user_id: int

    amount: int

    source_type: str

    source_id: Optional[int] = None

    description_ar: Optional[str] = None

    description_en: Optional[str] = None



# =====================================================
# XP TRANSACTION RESPONSE
# =====================================================

class XPTransactionResponse(BaseModel):

    id: int

    user_id: int

    amount: int

    source_type: str

    source_id: Optional[int] = None

    description_ar: Optional[str] = None

    description_en: Optional[str] = None

    created_at: datetime


    model_config = ConfigDict(
        from_attributes=True
    )



# =====================================================
# USER XP RESPONSE
# =====================================================

class UserXPResponse(BaseModel):

    user_id: int

    total_xp: int

    transactions: List[XPTransactionResponse]


    model_config = ConfigDict(
        from_attributes=True
    )