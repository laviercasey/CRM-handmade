from datetime import datetime, timedelta
from sqlalchemy import func, and_, extract, cast, Numeric
from sqlalchemy.orm import Session
from typing import List, Dict, Any
import logging

from app.models.request import Request
from app.models.product import Product
from app.models.material import Material
from app.schemas.analytics import ProductCalculationInput

logger = logging.getLogger(__name__)

def get_financial_stats(db: Session, user_id: int, period: str):
    today = datetime.now().date()
    if period == "week":
        start_date = today - timedelta(days=today.weekday(), weeks=0)
    elif period == "month":
        start_date = today.replace(day=1)
    elif period == "quarter":
        current_quarter = (today.month - 1) // 3 + 1
        start_date = datetime(today.year, 3 * current_quarter - 2, 1).date()
    elif period == "year":
        start_date = today.replace(month=1, day=1)
    else:
        start_date = today.replace(day=1)  
    
    start_datetime = datetime.combine(start_date, datetime.min.time())
    end_datetime = datetime.combine(today, datetime.max.time())
    
    income_query = db.query(func.coalesce(func.sum(Request.price), 0).label('income')).filter(
        Request.user_id == user_id,
        Request.status == 'done',
        Request.created_at.between(start_datetime, end_datetime)
    )
    income_result = income_query.first()
    income = income_result.income if income_result else 0
    
    expenses_query = db.query(func.coalesce(func.sum(Material.price), 0).label('expenses')).filter(
        Material.user_id == user_id,
        Material.created_at.between(start_datetime, end_datetime)
    )
    expenses_result = expenses_query.first()
    expenses = expenses_result.expenses if expenses_result else 0
    
    profit = income - expenses
    
    return {
        "income": float(income),
        "expenses": float(expenses),
        "profit": float(profit)
    }


def get_profit_trend(db: Session, user_id: int, period: str):
    today = datetime.now().date()
    result = []
    
    if period == "week":
        start_date = today - timedelta(days=today.weekday(), weeks=0)
        day_names = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"]
        
        for i in range(7):
            current_date = start_date + timedelta(days=i)
            day_start = datetime.combine(current_date, datetime.min.time())
            day_end = datetime.combine(current_date, datetime.max.time())
            
            income = db.query(func.coalesce(func.sum(Request.price), 0)).filter(
                Request.user_id == user_id,
                Request.status == 'done',
                Request.created_at.between(day_start, day_end)
            ).scalar() or 0
            
            expenses = db.query(func.coalesce(func.sum(Material.price), 0)).filter(
                Material.user_id == user_id,
                Material.created_at.between(day_start, day_end)
            ).scalar() or 0
            
            profit = income - expenses
            
            result.append({
                "label": day_names[i],
                "value": float(profit)
            })
            
    elif period == "month":
        start_date = today.replace(day=1)
        first_day = start_date
        last_day = (first_day.replace(month=first_day.month % 12 + 1, day=1) - timedelta(days=1))
        total_days = (last_day - first_day).days + 1
        total_weeks = (total_days + 6) // 7
        
        for week in range(total_weeks):
            week_start = first_day + timedelta(days=week * 7)
            week_end = min(week_start + timedelta(days=6), last_day)
            week_start_dt = datetime.combine(week_start, datetime.min.time())
            week_end_dt = datetime.combine(week_end, datetime.max.time())
            
            income = db.query(func.coalesce(func.sum(Request.price), 0)).filter(
                Request.user_id == user_id,
                Request.status == 'done',
                Request.created_at.between(week_start_dt, week_end_dt)
            ).scalar() or 0
            
            expenses = db.query(func.coalesce(func.sum(Material.price), 0)).filter(
                Material.user_id == user_id,
                Material.created_at.between(week_start_dt, week_end_dt)
            ).scalar() or 0

            profit = income - expenses
            
            result.append({
                "label": f"Нед {week + 1}",
                "value": float(profit)
            })
            
    elif period == "quarter":
        current_quarter = (today.month - 1) // 3 + 1
        quarter_start_month = 3 * current_quarter - 2
        month_names = ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"]
        
        for i in range(3):
            month_num = quarter_start_month + i
            month_start = datetime(today.year, month_num, 1)
            if month_num == 12:
                month_end = datetime(today.year + 1, 1, 1) - timedelta(days=1)
            else:
                month_end = datetime(today.year, month_num + 1, 1) - timedelta(days=1)
            
            month_start_dt = datetime.combine(month_start, datetime.min.time())
            month_end_dt = datetime.combine(month_end, datetime.max.time())
            
            income = db.query(func.coalesce(func.sum(Request.price), 0)).filter(
                Request.user_id == user_id,
                Request.status == 'done',
                Request.created_at.between(month_start_dt, month_end_dt)
            ).scalar() or 0
            
            expenses = db.query(func.coalesce(func.sum(Material.price), 0)).filter(
                Material.user_id == user_id,
                Material.created_at.between(month_start_dt, month_end_dt)
            ).scalar() or 0
            
            profit = income - expenses
            
            result.append({
                "label": month_names[month_num - 1],
                "value": float(profit)
            })
            
    elif period == "year":
        year_start = datetime(today.year, 1, 1)
        
        for quarter in range(1, 5):
            quarter_start_month = 3 * quarter - 2
            quarter_start = datetime(today.year, quarter_start_month, 1)
            
            if quarter == 4:
                quarter_end = datetime(today.year + 1, 1, 1) - timedelta(days=1)
            else:
                quarter_end = datetime(today.year, 3 * quarter + 1, 1) - timedelta(days=1)
            
            quarter_start_dt = datetime.combine(quarter_start, datetime.min.time())
            quarter_end_dt = datetime.combine(quarter_end, datetime.max.time())
            
            income = db.query(func.coalesce(func.sum(Request.price), 0)).filter(
                Request.user_id == user_id,
                Request.status == 'done',
                Request.created_at.between(quarter_start_dt, quarter_end_dt)
            ).scalar() or 0
            
            expenses = db.query(func.coalesce(func.sum(Material.price), 0)).filter(
                Material.user_id == user_id,
                Material.created_at.between(quarter_start_dt, quarter_end_dt)
            ).scalar() or 0
            
            profit = income - expenses
            
            result.append({
                "label": f"Q{quarter}",
                "value": float(profit)
            })
    
    return result


def get_top_products(db: Session, user_id: int, limit: int = 5):
    try:
        products = db.query(Product).filter(
            Product.user_id == user_id
        ).order_by(Product.price.desc()).limit(limit).all()

        completed_requests = db.query(Request).filter(
            Request.user_id == user_id,
            Request.status == 'done'
        ).all()
        
        product_mentions = {}
        
        for request in completed_requests:
            for product in products:
                if product.name.lower() in request.description.lower():
                    if product.id not in product_mentions:
                        product_mentions[product.id] = {
                            "count": 0,
                            "revenue": 0
                        }
                    product_mentions[product.id]["count"] += 1
                    product_mentions[product.id]["revenue"] += request.price
        
        result = []
        for product in products:
            mentions = product_mentions.get(product.id, {"count": 0, "revenue": 0})
            result.append({
                "id": product.id,
                "name": product.name,
                "img_name": product.img_name,
                "orderCount": mentions["count"],
                "totalRevenue": float(mentions["revenue"])
            })
        
        result.sort(key=lambda x: x["totalRevenue"], reverse=True)
        
        return result[:limit]
    except Exception as e:
        logger.error(f"Error in get_top_products: {e}")
        products = db.query(Product).filter(
            Product.user_id == user_id
        ).order_by(Product.price.desc()).limit(limit).all()
        
        return [
            {
                "id": product.id,
                "name": product.name,
                "img_name": product.img_name,
                "orderCount": 0,
                "totalRevenue": 0.0
            }
            for product in products
        ]


def calculate_product_price(db: Session, calculation_data: ProductCalculationInput, user_id: int):
    materials_cost = 0
    if calculation_data.materials:
        materials = db.query(Material).filter(
            Material.id.in_(calculation_data.materials),
            Material.user_id == user_id
        ).all()
        materials_cost = sum(material.price for material in materials)
    
    labor_cost = calculation_data.workHours * calculation_data.hourlyRate
    
    cost_price = materials_cost + labor_cost + calculation_data.additionalCosts
    
    margin = cost_price * (calculation_data.profitMargin / 100)
    
    total_price = cost_price + margin
    
    return {
        "materialsCost": float(materials_cost),
        "laborCost": float(labor_cost),
        "additionalCosts": float(calculation_data.additionalCosts),
        "costPrice": float(cost_price),
        "margin": float(margin),
        "totalPrice": float(total_price)
    }


def get_statistics_overview(db: Session, user_id: int):
    current_date = datetime.now()
    month_ago = current_date - timedelta(days=30)
    two_months_ago = current_date - timedelta(days=60)
    
    total_requests = db.query(Request).filter(
        Request.user_id == user_id
    ).count()
    
    requests_last_month = db.query(Request).filter(
        Request.user_id == user_id,
        Request.created_at >= month_ago
    ).count()
    
    requests_previous_month = db.query(Request).filter(
        Request.user_id == user_id,
        Request.created_at >= two_months_ago,
        Request.created_at < month_ago
    ).count()
    
    requests_change = 0
    if requests_previous_month > 0:
        requests_change = int(((requests_last_month - requests_previous_month) / requests_previous_month) * 100)
    
    total_products = db.query(Product).filter(
        Product.user_id == user_id
    ).count()
    
    products_last_month = db.query(Product).filter(
        Product.user_id == user_id,
        Product.created_at >= month_ago
    ).count()
    
    products_previous_month = db.query(Product).filter(
        Product.user_id == user_id,
        Product.created_at >= two_months_ago,
        Product.created_at < month_ago
    ).count()
    
    products_change = 0
    if products_previous_month > 0:
        products_change = int(((products_last_month - products_previous_month) / products_previous_month) * 100)
    
    total_revenue = db.query(func.sum(Request.price)).filter(
        Request.user_id == user_id,
        Request.status == 'done'
    ).scalar() or 0
    
    revenue_last_month = db.query(func.sum(Request.price)).filter(
        Request.user_id == user_id,
        Request.status == 'done',
        Request.created_at >= month_ago
    ).scalar() or 0
    
    revenue_previous_month = db.query(func.sum(Request.price)).filter(
        Request.user_id == user_id,
        Request.status == 'done',
        Request.created_at >= two_months_ago,
        Request.created_at < month_ago
    ).scalar() or 0
    
    revenue_change = 0
    if revenue_previous_month > 0:
        revenue_change = int(((revenue_last_month - revenue_previous_month) / revenue_previous_month) * 100)
    
    return {
        "totalRequests": total_requests,
        "totalProducts": total_products,
        "totalRevenue": float(total_revenue),
        "requestsChange": requests_change,
        "productsChange": products_change,
        "revenueChange": revenue_change
    }


def get_requests_by_status(db: Session, user_id: int):
    pending_count = db.query(Request).filter(
        Request.user_id == user_id,
        Request.status == 'pending'
    ).count()
    
    accepted_count = db.query(Request).filter(
        Request.user_id == user_id,
        Request.status == 'accepted'
    ).count()
    
    rejected_count = db.query(Request).filter(
        Request.user_id == user_id,
        Request.status == 'rejected'
    ).count()
    
    done_count = db.query(Request).filter(
        Request.user_id == user_id,
        Request.status == 'done'
    ).count()
    
    return {
        "pending": pending_count,
        "accepted": accepted_count,
        "rejected": rejected_count,
        "done": done_count
    }


def get_activity_by_day(db: Session, user_id: int, period: str = "week"):

    current_date = datetime.now()
    
    
    if period == "week":
        start_date = current_date - timedelta(days=current_date.weekday())
        days = 7
        date_format = "%a"  
    elif period == "month":
        start_date = current_date.replace(day=1)
        
        if current_date.month == 12:
            last_day = current_date.replace(year=current_date.year + 1, month=1, day=1) - timedelta(days=1)
        else:
            last_day = current_date.replace(month=current_date.month + 1, day=1) - timedelta(days=1)
        days = last_day.day
        date_format = "%d"
    elif period == "quarter":
        quarter_month = ((current_date.month - 1) // 3) * 3 + 1
        start_date = current_date.replace(month=quarter_month, day=1)
        days = 3 
        date_format = "%b"  
    elif period == "year":
        start_date = current_date.replace(month=1, day=1)
        days = 12  
        date_format = "%b" 
    else:
        start_date = current_date - timedelta(days=current_date.weekday())
        days = 7
        date_format = "%a"
    
    result = []
    for i in range(days):
        if period == "week":
            date = start_date + timedelta(days=i)
            label = date.strftime(date_format)
        elif period == "month":
            date = start_date + timedelta(days=i)
            label = date.strftime(date_format)
        elif period == "quarter":
            date = start_date.replace(month=start_date.month + i)
            label = date.strftime(date_format)
        elif period == "year":
            date = start_date.replace(month=i + 1)
            label = date.strftime(date_format)
        
        if period in ["week", "month"]:
            period_start = datetime.combine(date, datetime.min.time())
            period_end = datetime.combine(date, datetime.max.time())
        elif period == "quarter":
            period_start = datetime.combine(date.replace(day=1), datetime.min.time())
            if date.month == 12:
                period_end = datetime.combine(date.replace(year=date.year + 1, month=1, day=1) - timedelta(days=1), datetime.max.time())
            else:
                period_end = datetime.combine(date.replace(month=date.month + 1, day=1) - timedelta(days=1), datetime.max.time())
        elif period == "year":
            period_start = datetime.combine(date.replace(day=1), datetime.min.time())
            if date.month == 12:
                period_end = datetime.combine(date.replace(year=date.year + 1, month=1, day=1) - timedelta(days=1), datetime.max.time())
            else:
                period_end = datetime.combine(date.replace(month=date.month + 1, day=1) - timedelta(days=1), datetime.max.time())
        
        requests_count = db.query(Request).filter(
            Request.user_id == user_id,
            Request.created_at >= period_start,
            Request.created_at <= period_end
        ).count()
        
        products_count = db.query(Product).filter(
            Product.user_id == user_id,
            Product.created_at >= period_start,
            Product.created_at <= period_end
        ).count()
        
        activity_count = requests_count + products_count
        
        result.append({
            "label": label,
            "count": activity_count
        })
    
    return result
