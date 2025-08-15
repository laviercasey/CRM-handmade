from pydantic import BaseModel, Field
from typing import List, Optional


class FinancialStats(BaseModel):
    income: float
    expenses: float
    profit: float


class ProfitTrendItem(BaseModel):
    label: str
    value: float


class TopProduct(BaseModel):
    id: int
    name: str
    img_name: Optional[str] = None
    orderCount: int
    totalRevenue: float


class ProductCalculationInput(BaseModel):
    materials: List[int] = Field(default_factory=list)
    workHours: float = Field(..., ge=0)
    hourlyRate: float = Field(..., ge=0)
    additionalCosts: float = Field(0, ge=0)
    profitMargin: float = Field(..., ge=0, le=100)


class ProductCalculation(BaseModel):
    materialsCost: float
    laborCost: float
    additionalCosts: float
    costPrice: float
    margin: float
    totalPrice: float


class StatisticsOverview(BaseModel):
    totalRequests: int
    totalProducts: int
    totalRevenue: float
    requestsChange: int
    productsChange: int
    revenueChange: int


class RequestsByStatus(BaseModel):
    pending: int
    accepted: int
    rejected: int
    done: int


class ActivityItem(BaseModel):
    label: str
    count: int


class StatisticsReport(BaseModel):
    format: str = Field("pdf", pattern="^(pdf|csv|excel)$")
