import { db } from "@db";
import { judicialDecisions, laborContracts } from "@shared/schema";
import { eq, and, gte, lte, count, sql, desc } from "drizzle-orm";

/**
 * Service for retrieving analytics data for documents
 */
export const analyticsService = {
  /**
   * Get statistical overview of judicial decisions
   */
  async getJudicialDecisionStats(timeframe: string = "all") {
    // Define date range for queries
    const endDate = new Date();
    let startDate = new Date(0); // Default to all time

    if (timeframe === "week") {
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);
    } else if (timeframe === "month") {
      startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 1);
    } else if (timeframe === "year") {
      startDate = new Date();
      startDate.setFullYear(startDate.getFullYear() - 1);
    }

    // Get total count
    const totalCount = await db
      .select({ count: count() })
      .from(judicialDecisions)
      .where(
        timeframe !== "all"
          ? and(
              gte(judicialDecisions.createdAt, startDate),
              lte(judicialDecisions.createdAt, endDate)
            )
          : undefined
      );

    // Get jurisdiction distribution
    const jurisdictionStats = await db
      .select({
        jurisdiction: judicialDecisions.jurisdiction,
        count: count(),
      })
      .from(judicialDecisions)
      .where(
        timeframe !== "all"
          ? and(
              gte(judicialDecisions.createdAt, startDate),
              lte(judicialDecisions.createdAt, endDate)
            )
          : undefined
      )
      .groupBy(judicialDecisions.jurisdiction)
      .orderBy(desc(sql<number>\`count(*)\`));

    // Get category distribution
    const categoryStats = await db
      .select({
        category: judicialDecisions.category,
        count: count(),
      })
      .from(judicialDecisions)
      .where(
        timeframe !== "all"
          ? and(
              gte(judicialDecisions.createdAt, startDate),
              lte(judicialDecisions.createdAt, endDate)
            )
          : undefined
      )
      .groupBy(judicialDecisions.category)
      .orderBy(desc(sql<number>\`count(*)\`));

    // Get time series data (decisions per month)
    const timeSeries = await db.execute(
      sql\`
        SELECT 
          DATE_TRUNC('month', "created_at") as month,
          COUNT(*) as count
        FROM judicial_decisions
        WHERE ${
          timeframe !== "all"
            ? sql\`"created_at" >= ${startDate} AND "created_at" <= ${endDate}\`
            : sql\`1=1\`
        }
        GROUP BY DATE_TRUNC('month', "created_at")
        ORDER BY month
      \`
    );

    return {
      totalCount: totalCount[0]?.count || 0,
      jurisdictionDistribution: jurisdictionStats,
      categoryDistribution: categoryStats,
      timeSeriesData: timeSeries.rows.map((row: any) => ({
        month: row.month,
        count: parseInt(row.count),
      })),
    };
  },

  /**
   * Get statistical overview of labor contracts
   */
  async getLaborContractStats(timeframe: string = "all") {
    // Define date range for queries
    const endDate = new Date();
    let startDate = new Date(0); // Default to all time

    if (timeframe === "week") {
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);
    } else if (timeframe === "month") {
      startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 1);
    } else if (timeframe === "year") {
      startDate = new Date();
      startDate.setFullYear(startDate.getFullYear() - 1);
    }

    // Get total count
    const totalCount = await db
      .select({ count: count() })
      .from(laborContracts)
      .where(
        timeframe !== "all"
          ? and(
              gte(laborContracts.createdAt, startDate),
              lte(laborContracts.createdAt, endDate)
            )
          : undefined
      );

    // Get contract type distribution
    const contractTypeStats = await db
      .select({
        contractType: laborContracts.contractType,
        count: count(),
      })
      .from(laborContracts)
      .where(
        timeframe !== "all"
          ? and(
              gte(laborContracts.createdAt, startDate),
              lte(laborContracts.createdAt, endDate)
            )
          : undefined
      )
      .groupBy(laborContracts.contractType)
      .orderBy(desc(sql<number>\`count(*)\`));

    // Get industry distribution
    const industryStats = await db
      .select({
        industry: laborContracts.industry,
        count: count(),
      })
      .from(laborContracts)
      .where(
        timeframe !== "all"
          ? and(
              gte(laborContracts.createdAt, startDate),
              lte(laborContracts.createdAt, endDate)
            )
          : undefined
      )
      .groupBy(laborContracts.industry)
      .orderBy(desc(sql<number>\`count(*)\`));

    // Get time series data (contracts per month)
    const timeSeries = await db.execute(
      sql\`
        SELECT 
          DATE_TRUNC('month', "created_at") as month,
          COUNT(*) as count
        FROM labor_contracts
        WHERE ${
          timeframe !== "all"
            ? sql\`"created_at" >= ${startDate} AND "created_at" <= ${endDate}\`
            : sql\`1=1\`
        }
        GROUP BY DATE_TRUNC('month', "created_at")
        ORDER BY month
      \`
    );

    // Get page length distribution
    const pageLengthStats = await db.execute(
      sql\`
        SELECT 
          CASE 
            WHEN pages <= 5 THEN '1-5'
            WHEN pages <= 10 THEN '6-10'
            WHEN pages <= 20 THEN '11-20'
            WHEN pages <= 50 THEN '21-50'
            ELSE '50+'
          END as page_range,
          COUNT(*) as count
        FROM labor_contracts
        WHERE ${
          timeframe !== "all"
            ? sql\`"created_at" >= ${startDate} AND "created_at" <= ${endDate}\`
            : sql\`1=1\`
        }
        GROUP BY page_range
        ORDER BY 
          CASE 
            WHEN page_range = '1-5' THEN 1
            WHEN page_range = '6-10' THEN 2
            WHEN page_range = '11-20' THEN 3
            WHEN page_range = '21-50' THEN 4
            WHEN page_range = '50+' THEN 5
          END
      \`
    );

    return {
      totalCount: totalCount[0]?.count || 0,
      contractTypeDistribution: contractTypeStats,
      industryDistribution: industryStats,
      timeSeriesData: timeSeries.rows.map((row: any) => ({
        month: row.month,
        count: parseInt(row.count),
      })),
      pageLengthDistribution: pageLengthStats.rows.map((row: any) => ({
        range: row.page_range,
        count: parseInt(row.count),
      })),
    };
  },

  /**
   * Get comparative analytics between judicial decisions and labor contracts 
   */
  async getComparativeAnalytics() {
    // Get document counts over time
    const timeSeries = await db.execute(
      sql\`
        WITH decision_counts AS (
          SELECT 
            DATE_TRUNC('month', "created_at") as month,
            COUNT(*) as decision_count,
            0 as contract_count
          FROM judicial_decisions
          GROUP BY month
        ),
        contract_counts AS (
          SELECT 
            DATE_TRUNC('month', "created_at") as month,
            0 as decision_count,
            COUNT(*) as contract_count
          FROM labor_contracts
          GROUP BY month
        ),
        combined AS (
          SELECT * FROM decision_counts
          UNION ALL
          SELECT * FROM contract_counts
        )
        SELECT 
          month, 
          SUM(decision_count) as decision_count,
          SUM(contract_count) as contract_count
        FROM combined
        GROUP BY month
        ORDER BY month
      \`
    );

    // Get tag overlap
    const tagOverlap = await db.execute(
      sql\`
        WITH decision_tags AS (
          SELECT DISTINCT unnest(tags) as tag
          FROM judicial_decisions
          WHERE tags IS NOT NULL
        ),
        contract_tags AS (
          SELECT DISTINCT unnest(tags) as tag
          FROM labor_contracts
          WHERE tags IS NOT NULL
        ),
        tag_counts AS (
          SELECT
            t.tag,
            (SELECT COUNT(*) FROM judicial_decisions WHERE tags @> ARRAY[t.tag]) as decision_count,
            (SELECT COUNT(*) FROM labor_contracts WHERE tags @> ARRAY[t.tag]) as contract_count
          FROM (
            SELECT tag FROM decision_tags
            UNION
            SELECT tag FROM contract_tags
          ) t
        )
        SELECT * FROM tag_counts
        WHERE decision_count > 0 AND contract_count > 0
        ORDER BY decision_count + contract_count DESC
        LIMIT 10
      \`
    );

    return {
      timeSeriesData: timeSeries.rows.map((row: any) => ({
        month: row.month,
        decisionCount: parseInt(row.decision_count),
        contractCount: parseInt(row.contract_count),
      })),
      tagOverlap: tagOverlap.rows.map((row: any) => ({
        tag: row.tag,
        decisionCount: parseInt(row.decision_count),
        contractCount: parseInt(row.contract_count),
      })),
    };
  },

  /**
   * Get document activity metrics
   */
  async getActivityMetrics(timeperiod: string = "week") {
    // Define date range for queries
    const endDate = new Date();
    let startDate = new Date();

    if (timeperiod === "week") {
      startDate.setDate(startDate.getDate() - 7);
    } else if (timeperiod === "month") {
      startDate.setMonth(startDate.getMonth() - 1);
    } else if (timeperiod === "year") {
      startDate.setFullYear(startDate.getFullYear() - 1);
    } else {
      // Default to week
      startDate.setDate(startDate.getDate() - 7);
    }

    // Get number of new judicial decisions
    const newDecisionsCount = await db
      .select({ count: count() })
      .from(judicialDecisions)
      .where(
        and(
          gte(judicialDecisions.createdAt, startDate),
          lte(judicialDecisions.createdAt, endDate)
        )
      );

    // Get number of new labor contracts
    const newContractsCount = await db
      .select({ count: count() })
      .from(laborContracts)
      .where(
        and(
          gte(laborContracts.createdAt, startDate),
          lte(laborContracts.createdAt, endDate)
        )
      );

    // Get total contract downloads
    const totalDownloads = await db
      .select({
        total: sql<number>\`SUM(COALESCE(downloads, 0))\`,
      })
      .from(laborContracts)
      .where(
        and(
          gte(laborContracts.createdAt, startDate),
          lte(laborContracts.createdAt, endDate)
        )
      );

    return {
      newDecisionsCount: newDecisionsCount[0]?.count || 0,
      newContractsCount: newContractsCount[0]?.count || 0,
      totalDownloads: totalDownloads[0]?.total || 0,
      timeperiod,
    };
  }
};