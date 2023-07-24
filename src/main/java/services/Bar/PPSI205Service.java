package services.Bar;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.sql.*;
import java.sql.Date;
import java.text.SimpleDateFormat;
import java.util.*;

import model.*;
import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONObject;

import utils.common.CommonBo;
import utils.date.DateUtil;
import utils.sql.Druid;

public class PPSI205Service {

	private static Logger log = Logger.getLogger(PPSI205Service.class);
	
	CommonBo BO = new CommonBo();

	List<TBPPSM101> PPSM101List;
	List<TBPPSM102> PPSM102List;
	List<TBPPSM113> PPSM113List;
	List<CALENDARDATA> checkDataList = new ArrayList<>();


	/**
	 * getTbppsm101List 取得尺寸優先順序
	 * @param _plantCode 廠區別
	 * @return
	 * @throws SQLException
	 */
	public List<TBPPSM101> getTbppsm101List(String _plantCode) throws SQLException {
		Connection conn = null;
		PreparedStatement psmt = null;
		ResultSet resultSet = null;
		PPSM101List = new ArrayList<>();
		try {
			//取得連接
			conn = Druid.getConn();

			String query = String.format(" select A.IMPORTDATETIME, A.PLANT_CODE, A.CUSTOM_SORT, A.USE_MONTH, A.SCH_SHOP_CODE, A.EQUIP_CODE, A.OUTPUT_SHAPE, A.OUT_DIA, A.SFC_DIA, "
							+ " A.FINAL_PROCESS_CODE, A.GRADE_GROUP, A.PROCESS_CODE, A.DATE_CREATE, A.USER_CREATE, A.DATE_UPDATE, A.USER_UPDATE     "
							+ " from tbppsm101 A where A.PLANT_CODE = '%s'  order by A.IMPORTDATETIME desc, A.CUSTOM_SORT", _plantCode);

			//預處理SQL
			psmt = null;
			psmt = conn.prepareStatement(query);

			//查詢請求
			resultSet = psmt.executeQuery();

			//結果集
			PPSM101List.clear();
			while (resultSet.next()) {
				TBPPSM101 model = new TBPPSM101();
				model.setIMPORTDATETIME(resultSet.getString("IMPORTDATETIME"));
				model.setPLANT_CODE(resultSet.getString("PLANT_CODE"));
				model.setCUSTOM_SORT(resultSet.getInt("CUSTOM_SORT"));
				model.setUSE_MONTH(resultSet.getString("USE_MONTH"));
				model.setSCH_SHOP_CODE(resultSet.getString("SCH_SHOP_CODE"));
				model.setEQUIP_CODE(resultSet.getString("EQUIP_CODE"));
				model.setOUTPUT_SHAPE(resultSet.getString("OUTPUT_SHAPE"));
				model.setOUT_DIA(resultSet.getFloat("OUT_DIA"));
				model.setSFC_DIA(resultSet.getFloat("SFC_DIA"));
				model.setFINAL_PROCESS_CODE(resultSet.getString("FINAL_PROCESS_CODE"));
				model.setGRADE_GROUP(resultSet.getString("GRADE_GROUP"));
				model.setPROCESS_CODE(resultSet.getString("PROCESS_CODE"));
				model.setDATE_CREATE(resultSet.getString("DATE_CREATE"));
				model.setUSER_CREATE(resultSet.getString("USER_CREATE"));
				model.setDATE_UPDATE(resultSet.getString("DATE_UPDATE"));
				model.setUSER_UPDATE(resultSet.getString("USER_UPDATE"));
				PPSM101List.add(model);
			}

			// Close
			resultSet.close();

		} catch (Throwable e) {
			if (conn != null) {
				try {
					//Roll back
					conn.rollback();
				} catch (SQLException e1) {
					e1.printStackTrace();
				}
			}
			throw new RuntimeException(e);
		} finally {
			if (conn != null) {
				try {
					psmt.close();
					conn.close();
				} catch (SQLException e) {
					e.printStackTrace();
				}
			}
		}
		return PPSM101List;
	}


	/**
	 * getTbppsm102List 取得401站資料
	 * @param _plantCode 廠區別
	 * @return
	 * @throws SQLException
	 */
	public List<TBPPSM102> getTbppsm102List(String _plantCode) throws SQLException {
		Connection conn = null;
		PreparedStatement psmt = null;
		ResultSet resultSet = null;
		PPSM102List = new ArrayList<>();
		try {
			//取得連接
			conn = Druid.getConn();

			String query = " select A.IMPORTDATETIME, A.PLANT_CODE, A.ORDER_ID, A.SCH_SHOP_CODE, A.EQUIP_CODE, A.NEXT_SHOP_CODE, DATE_FORMAT(A.MAX_DATE, \"%Y-%m\") MAX_DATE,  " +
							" A.DAYS, A.STARTDATE, date_add(A.STARTDATE, interval A.DAYS day) ENDDATE, A.TC_FREQUENCE_LIFT, concat('C', A.SCH_SHOP_CODE, A.EQUIP_CODE, '-', LPAD(A.ORDER_ID, 2, 0)) COMPAIGN_ID, A.EXPORTDATETIME,   " +
							" A.DATE_CREATE, A.USER_CREATE, A.DATE_UPDATE, A.USER_UPDATE   " +
							" from tbppsm102 A where  A.PLANT_CODE = ?  ";

			//預處理SQL
			psmt = null;
			psmt = conn.prepareStatement(query);
			psmt.setString(1, _plantCode);

			//查詢請求
			resultSet = psmt.executeQuery();

			//結果集
			PPSM102List.clear();
			while (resultSet.next()) {
				TBPPSM102 model = new TBPPSM102();
				model.setIMPORTDATETIME(resultSet.getString("IMPORTDATETIME"));
				model.setPLANT_CODE(resultSet.getString("PLANT_CODE"));
				model.setORDER_ID(resultSet.getInt("ORDER_ID"));
				model.setSCH_SHOP_CODE(resultSet.getString("SCH_SHOP_CODE"));
				model.setEQUIP_CODE(resultSet.getString("EQUIP_CODE"));
				model.setNEXT_SHOP_CODE(resultSet.getString("NEXT_SHOP_CODE"));
				model.setMAX_DATE(resultSet.getString("MAX_DATE"));
				model.setDAYS(resultSet.getInt("DAYS"));
				model.setSTARTDATE(resultSet.getString("STARTDATE"));
				model.setENDDATE(resultSet.getString("ENDDATE"));
				model.setTC_FREQUENCE_LIFT(resultSet.getString("TC_FREQUENCE_LIFT"));
				model.setCOMPAIGN_ID(resultSet.getString("COMPAIGN_ID"));
				model.setEXPORTDATETIME(resultSet.getString("EXPORTDATETIME"));
				model.setDATE_CREATE(resultSet.getString("DATE_CREATE"));
				model.setUSER_CREATE(resultSet.getString("USER_CREATE"));
				model.setDATE_UPDATE(resultSet.getString("DATE_UPDATE"));
				model.setUSER_UPDATE(resultSet.getString("USER_UPDATE"));
				PPSM102List.add(model);
			}

			// Close
			resultSet.close();

		} catch (Throwable e) {
			if (conn != null) {
				try {
					//Roll back
					conn.rollback();
				} catch (SQLException e1) {
					e1.printStackTrace();
				}
			}
			throw new RuntimeException(e);
		} finally {
			if (conn != null) {
				try {
//					psmt.close();
					conn.close();
				} catch (SQLException e) {
					e.printStackTrace();
				}
			}
		}
		return PPSM102List;
	}



/**
	 * getTbppsm113List 取得205站資料
	 * @param _plantCode 廠區別
	 * @return
	 * @throws SQLException
	 */
	public List<TBPPSM113> getTbppsm113List(String _plantCode) throws SQLException {
		Connection conn = null;
		PreparedStatement psmt = null;
		ResultSet resultSet = null;
		PPSM113List = new ArrayList<>();
		try {
			//取得連接
			conn = Druid.getConn();

			String query = " select * " +
							" from tbppsm113 A where  A.PLANT_CODE = ?  ";

			//預處理SQL
			psmt = null;
			psmt = conn.prepareStatement(query);
			psmt.setString(1, _plantCode);

			//查詢請求
			resultSet = psmt.executeQuery();

			//結果集
			PPSM113List.clear();
			while (resultSet.next()) {
				TBPPSM113 tbppsm113 = new TBPPSM113();
				tbppsm113.setId(resultSet.getInt("ID"));
				tbppsm113.setImportdatetime(resultSet.getString("IMPORTDATETIME"));
				tbppsm113.setPlantCode(resultSet.getString("PLANT_CODE"));
				tbppsm113.setPublicMonth(resultSet.getString("PUBLIC_MONTH"));
				tbppsm113.setProductType(resultSet.getString("PRODUCT_TYPE"));
				tbppsm113.setDia(resultSet.getInt("DIA"));
				tbppsm113.setCycleNo(resultSet.getString("CYCLE_NO"));
				tbppsm113.setStartDate(resultSet.getString("START_DATE"));
				tbppsm113.setEndDate(resultSet.getString("END_DATE"));
				tbppsm113.setExportdatetime(resultSet.getString("EXPORTDATETIME"));
				tbppsm113.setDateCreate(resultSet.getString("DATE_CREATE"));
				tbppsm113.setUserCreate(resultSet.getString("USER_CREATE"));
				tbppsm113.setDateUpdate(resultSet.getString("DATE_UPDATE"));
				tbppsm113.setUserUpdate(resultSet.getString("USER_UPDATE"));

				PPSM113List.add(tbppsm113);
			}

			// Close
			resultSet.close();

		} catch (Throwable e) {
			if (conn != null) {
				try {
					//Roll back
					conn.rollback();
				} catch (SQLException e1) {
					e1.printStackTrace();
				}
			}
			throw new RuntimeException(e);
		} finally {
			if (conn != null) {
				try {
//					psmt.close();
					conn.close();
				} catch (SQLException e) {
					e.printStackTrace();
				}
			}
		}
		return PPSM113List;
	}

	/**
	 * 取得欄位資料
	 * @param _plantCode
	 * @return
	 * @throws SQLException
	 */
	public List<TBPPSM119> getTbppsm119ListAll(String _plantCode) throws SQLException {

		Connection conn = null;
		PreparedStatement psmt = null;
		ResultSet resultSet = null;
		List<TBPPSM119> PPSM119List = new ArrayList<>();

		try {
			//取得連接
			conn = Druid.getConn();

			String query = String.format("select * from tbppsm119", _plantCode);

			//預處理SQL
			psmt = null;
			psmt = conn.prepareStatement(query);

			//查詢請求
			resultSet = psmt.executeQuery();

			//結果集
			PPSM119List.clear();
			while (resultSet.next()) {
				TBPPSM119 model = new TBPPSM119();
				model.setMoEdition(resultSet.getString("MO_EDITION"));
				model.setExportDateTime(resultSet.getString("EXPORTDATETIME"));
				model.setWorkTIme1(resultSet.getBigDecimal("WORK_TIME1"));
				model.setWorkTIme2(resultSet.getBigDecimal("WORK_TIME2"));
				model.setLeastTime1(resultSet.getBigDecimal("LEAST_TIME1"));
				model.setLeastTime2(resultSet.getBigDecimal("LEAST_TIME2"));
				model.setStartDate(resultSet.getString("START_DATE"));
				model.setEndDate(resultSet.getString("END_DATE"));

				PPSM119List.add(model);
			}

			// Close
			resultSet.close();

		}catch (Throwable e) {
			if (conn != null) {
				try {
					//Roll back
					conn.rollback();
				} catch (SQLException e1) {
					e1.printStackTrace();
				}
			}
			throw new RuntimeException(e);
		}finally {
			if (conn != null) {
				try {
//					psmt.close();
					conn.close();
				} catch (SQLException ex) {
					ex.printStackTrace();
				}
			}
		}
		return PPSM119List;
	}

	/**
	 * getVersionList I205_401 取得版次
	 * @param searchData
	 * @return
	 * @throws SQLException
	 */
	public List<VerList> getTbppsm119VerList(TBPPSM119 searchData) throws SQLException {

		Connection conn = null;
		PreparedStatement psmt = null;
		ResultSet resultSet = null;
		List<VerList> VersionList = new ArrayList<>();

		try {
			//取得連接
			conn = Druid.getConn();
			String query = "select MO_EDITION from ppsfcptb16 where MO_EDITION is not null group by MO_EDITION order by MO_EDITION desc limit 10";

			//預處理SQL
			psmt = null;
			psmt = conn.prepareStatement(query);

			//查詢請求
			resultSet = psmt.executeQuery();
			//結果集
			VersionList.clear();
			while (resultSet.next()) {
				VerList model = new VerList();
				model.setMO_EDITION(resultSet.getString("MO_EDITION"));
				VersionList.add(model);
			}
			// Close
			resultSet.close();

		} catch (Throwable e) {
			if (conn != null) {
				try {
					//Roll back
					conn.rollback();
				} catch (SQLException e1) {
					e1.printStackTrace();
				}
			}
			throw new RuntimeException(e);
		} finally {
			if (conn != null) {
				try {
					psmt.close();
					conn.close();
				} catch (SQLException e) {
					e.printStackTrace();
				}
			}
		}
		return VersionList;
	}

	/**
	 * importI205_1Excel 匯入420/430資料
	 * 
	 * @param model
	 * @param Arr
	 * @return
	 * @throws SQLException
	 */
	public String importI205_1Excel(TBPPSM101 model, JSONArray Arr) throws SQLException {
		Connection conn = null;
		ResultSet resultSet = null;
		PreparedStatement psmtC = null;
		PreparedStatement psmt = null;
		PreparedStatement psmtD = null;
		String json = "";
		try {

			//取得連接
			conn = Druid.getConn();
			conn.setAutoCommit(false);

			String TIMESTMP = BO.getSystemDateTimeVer();

//			insTmpDataList(TIMESTMP, Arr);		// 新增暫存資料列
//			checkDataList = new ArrayList<>();
//			checkDataList = checkDataList(conn, TIMESTMP, Arr);		// 檢查同機台日期是否重複

//			if (checkDataList.size() > 0) {
//				json = new Gson().toJson(checkDataList);
//				System.out.println("json :" + json);
//			} else {

//			 刪除tbppsm101 資料
			String queryD = String.format(" delete from tbppsm101  ");

			psmtD = conn.prepareStatement(queryD);
			psmtD.setQueryTimeout(5);
			psmtD.executeUpdate();

			// 將本批資料寫入 (tbppsm101)
			int j = 0;
			for(int i = 0; i < Arr.length() ; i ++) {
				j = i+1;
				JSONObject rec = Arr.getJSONObject(i);
				String useMonth = rec.getString("useMonth");
				String shopCode = rec.getString("shopCode");
				String equipCode = rec.getString("equipCode");
				String outputShap = rec.getString("outputShap");
				String outDia = rec.getString("outDia");
				String sfcDia = rec.getString("sfcDia");
				String finalProcessCode = rec.getString("finalProcessCode");
				String gradeGroup = rec.getString("gradeGroup");
				String processCode = rec.getString("processCode");

				String query = String.format("INSERT INTO tbppsm101 (IMPORTDATETIME,PLANT_CODE,CUSTOM_SORT,USE_MONTH,SCH_SHOP_CODE,EQUIP_CODE,OUTPUT_SHAPE,OUT_DIA,SFC_DIA,FINAL_PROCESS_CODE,GRADE_GROUP,PROCESS_CODE,USER_CREATE)  "
						+ "VALUES ('%s', '%s', %d, '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s')  ",
						TIMESTMP, model.getPLANT_CODE(), j, useMonth, shopCode, equipCode, outputShap, outDia, sfcDia, finalProcessCode, gradeGroup, processCode, model.getUSER_CREATE());

				psmt = conn.prepareStatement(query);
				psmt.setQueryTimeout(5);
				psmt.executeUpdate();
			}

			json = "[{\"MSG\":\"Y\"}]";
			System.out.println("-------------- msg : " +json);

//			dtlTmpDataList(TIMESTMP);	// 刪除暫存資料列
			// Commit
			conn.commit();

		} catch (Throwable e) {
			if (conn != null) {
				try {
					//Roll back
					conn.rollback();
				} catch (SQLException e1) {
					e1.printStackTrace();
				}
			}
			throw new RuntimeException(e);
		} finally {
			if (conn != null) {
				try {
					conn.close();
				} catch (SQLException e) {
					e.printStackTrace();
				}
			}
		}
		return json;
	}




	/**
	 * importI205_2Excel 匯入401資料
	 *
	 * @param model
	 * @param Arr
	 * @return
	 * @throws SQLException
	 */
	public String importI205_2Excel(TBPPSM102 model, JSONArray Arr) throws SQLException {
		Connection conn = null;
		ResultSet resultSet = null;
		PreparedStatement psmtC = null;
		PreparedStatement psmt = null;
		PreparedStatement psmtD = null;
		String json = "";
		try {

			//取得連接
			conn = Druid.getConn();
			conn.setAutoCommit(false);

			String TIMESTMP = BO.getSystemDateTimeVer();

//			insTmpDataList(TIMESTMP, Arr);		// 新增暫存資料列
//			checkDataList = new ArrayList<>();
//			checkDataList = checkDataList(conn, TIMESTMP, Arr);		// 檢查同機台日期是否重複

//			if (checkDataList.size() > 0) {
//				json = new Gson().toJson(checkDataList);
//				System.out.println("json :" + json);
//			} else {

				// 刪除tbppsm102 資料
				String queryD = String.format(" delete from tbppsm102  ");

				psmtD = conn.prepareStatement(queryD);
				psmtD.setQueryTimeout(5);
				psmtD.executeUpdate();

				// 將本批資料寫入 (tbppsm102)
				int j = 0;
				for(int i = 0; i < Arr.length() ; i ++) {
					j = i+1;
					JSONObject rec = Arr.getJSONObject(i);
					String shopCode = rec.getString("shopCode");
					String equipCode = rec.getString("equipCode");
					String nextShopCode = rec.getString("nextShopCode");
					String days = rec.getString("days");
					String maxDate = rec.getString("maxDate");
					String startDate = rec.getString("startDate");
					String tcFrequenceLeft = rec.optString("tcFrequenceLeft") ;

					String query = String.format("INSERT INTO tbppsm102 (IMPORTDATETIME, PLANT_CODE, ORDER_ID, SCH_SHOP_CODE, EQUIP_CODE, NEXT_SHOP_CODE, MAX_DATE, DAYS, STARTDATE, TC_FREQUENCE_LIFT, USER_CREATE) "
							+ "VALUES ('%s', '%s', %d, '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s')  ", TIMESTMP, model.getPLANT_CODE(), j, shopCode, equipCode, nextShopCode, maxDate, days, startDate, tcFrequenceLeft, model.getUSER_CREATE());

					psmt = conn.prepareStatement(query);
					psmt.setQueryTimeout(5);
					psmt.executeUpdate();
				}

				json = "[{\"MSG\":\"Y\"}]";
				System.out.println("-------------- msg : " +json);
//			}
//
//			dtlTmpDataList(TIMESTMP);	// 刪除暫存資料列
			// Commit
			conn.commit();

		} catch (Throwable e) {
			if (conn != null) {
				try {
					//Roll back
					conn.rollback();
				} catch (SQLException e1) {
					e1.printStackTrace();
				}
			}
			throw new RuntimeException(e);
		} finally {
			if (conn != null) {
				try {
					conn.close();
				} catch (SQLException e) {
					e.printStackTrace();
				}
			}
		}
		return json;
	}


	/**
	 * importCompaign 上傳 compaign資料到 ppsinptb16
	 * @param model
	 * @param Arr
	 * @return
	 * @throws SQLException
	 */
	public String importCompaign(TBPPSM102 model, JSONArray Arr) throws SQLException {
		DateUtil dateUtil = new DateUtil();
		Connection conn = null;
		PreparedStatement psmt = null;
		PreparedStatement psmtD = null;
		PreparedStatement psmtU = null;
		String json = "";
		try {

			//取得連接
			conn = Druid.getConn();
			conn.setAutoCommit(false);

			// 刪除 ppsinptb16 屬於 401-TC 的資料
			String queryD = String.format(" delete from ppsinptb16 where SHOP_CODE_SCHE = '401' and CHOOSE_EQUIP_CODE = 'TC'  ");

			psmtD = conn.prepareStatement(queryD);
			psmtD.setQueryTimeout(5);
			psmtD.executeUpdate();

			// 將本批資料寫入 (ppsinptb16)
			int j = 0;
			for(int i = 0; i < Arr.length() ; i ++) {
				j = i+1;
				JSONObject rec = Arr.getJSONObject(i);
				String shopCode = rec.getString("SCH_SHOP_CODE");
				String equipCode = rec.getString("EQUIP_CODE");
				String compaignID = rec.getString("COMPAIGN_ID");
				String nextShopCode = rec.getString("NEXT_SHOP_CODE");
				String dateDeliveryMin = dateUtil.getMonFirst(dateUtil.getMonthofDate(-3), "yyyy-MM-dd") + " 00:00:00";
				String dateDeliveryMax = dateUtil.getMonFirst(dateUtil.getMonthofDate(4), "yyyy-MM-dd") + " 00:00:00";			// 調整為訂單交期為 N+4個月 的第一天
				String startDate = rec.getString("STARTDATE");
				String endDate = rec.getString("ENDDATE");
				String tcFrequenceLeft = rec.getString("TC_FREQUENCE_LIFT").toLowerCase();
				String query = String.format("INSERT INTO ppsinptb16 (SHOP_CODE_SCHE,CHOOSE_EQUIP_CODE,COMPAIGN_ID,PARAMETER_COL,PARAMETER_CONDITION,PARAMETER_NAME,TURN_DIA_MAX_MIN,TURN_DIA_MAX_MAX,SCHE_TYPE,DATA_DELIVERY_RANGE_MIN,DATA_DELIVERY_RANGE_MAX,START_TIME,END_TIME,TC_FREQUENCE_LIFT) VALUES "
						+ "('%s', '%s', '%s', 'NEXT_SHOP_CODE', '=', '%s',  0, 999, '-', '%s', '%s', '%s', '%s', '%s')  ", shopCode, equipCode, compaignID, nextShopCode, dateDeliveryMin, dateDeliveryMax, startDate, endDate, tcFrequenceLeft);

				psmt = conn.prepareStatement(query);
				psmt.setQueryTimeout(5);
				psmt.executeUpdate();
			}

			// 更新 tbppsm102 表的 EXPORTDATETIME 時間
			String query1 = String.format(" update tbppsm102 set EXPORTDATETIME = '%s', USER_UPDATE = '%s' ",
					BO.getSystemDateTimeVer(), model.getUSER_UPDATE());

			psmtU = conn.prepareStatement(query1);
			psmtU.setQueryTimeout(5);
			psmtU.executeUpdate();

			json = "[{\"MSG\":\"Y\"}]";

			// Commit
			conn.commit();

		} catch (Throwable e) {
			if (conn != null) {
				try {
					//Roll back
					conn.rollback();
				} catch (SQLException e1) {
					e1.printStackTrace();
				}
			}
			throw new RuntimeException(e);
		} finally {
			if (conn != null) {
				try {
					conn.close();
				} catch (SQLException e) {
					e.printStackTrace();
				}
			}
		}
		return json;
	}


	/**
	 * upd102ListData 修改 102 資料
	 * @param model
	 * @param Obj1 old_list
	 * @param Obj2 new_list
	 * @return
	 * @throws SQLException
	 */
	public String upd102ListData(TBPPSM102 model, JSONObject Obj1, JSONObject Obj2) throws SQLException {
		Connection conn = null;
		PreparedStatement psmtU = null;
		String json = "";

		try {
			//取得連接
			conn = Druid.getConn();
			conn.setAutoCommit(false);

//			checkRowData = new ArrayList<>();
//			checkRowData = checkRowData(conn, Obj1, Obj2);		// 檢查資料是否重疊

//			if (checkRowData.size() > 0) {

//				json = new Gson().toJson(checkRowData);
//				System.out.println("json :" + json);
//			} else {
				String queryU = String.format("update tbppsm102 set NEXT_SHOP_CODE = '%s', MAX_DATE = '%s', DAYS = %d, STARTDATE = '%s' , TC_FREQUENCE_LIFT = '%s' , EXPORTDATETIME = '%s',   " +
								"USER_UPDATE = '%s', DATE_UPDATE = '%s' " +
								"where IMPORTDATETIME = '%s' and PLANT_CODE = '%s' and ORDER_ID = %d  ",
								Obj2.getString("NEXT_SHOP_CODE"), Obj2.getString("MAX_DATE")+"-01", Obj2.getInt("DAYS"), Obj2.getString("STARTDATE"), Obj2.getString("TC_FREQUENCE_LIFT"), Obj2.getString("EXPORTDATETIME"),
								model.getUSER_UPDATE(), model.getDATE_UPDATE(),
								Obj1.getString("IMPORTDATETIME"), Obj1.getString("PLANT_CODE"), Obj1.getInt("ORDER_ID"));

				psmtU = conn.prepareStatement(queryU);
				psmtU.setQueryTimeout(5);
				psmtU.executeUpdate();

				json = "[{\"MSG\":\"Y\"}]";

				System.out.println("-------------- msg : " +json);
//			}

			// Commit
			conn.commit();

		} catch (Throwable e) {
			if (conn != null) {
				try {
					//Roll back
					conn.rollback();
				} catch (SQLException e1) {
					e1.printStackTrace();
				}
			}
			throw new RuntimeException(e);
		} finally {
			if (conn != null) {
				try {
					conn.close();
				} catch (SQLException e) {
					e.printStackTrace();
				}
			}
		}
		return json;
	}


	/**
	 * upd113ListData 修改 113 資料
	 * @param model
	 * @param Obj1 old_list
	 * @param Obj2 new_list
	 * @return
	 * @throws SQLException
	 */
	public String upd113ListData(TBPPSM113 model, JSONObject Obj1, JSONObject Obj2) throws SQLException {
		Connection conn = null;
		PreparedStatement psmtU = null;
		String json = "";

		try {
			//取得連接
			conn = Druid.getConn();
			conn.setAutoCommit(false);


			String queryU = String.format("update tbppsm113 set PUBLIC_MONTH = '%s', PRODUCT_TYPE = '%s', DIA = '%s', CYCLE_NO = '%s' , START_DATE = '%s' , END_DATE = '%s',   " +
					"USER_UPDATE = '%s', DATE_UPDATE = '%s' " +
					"where IMPORTDATETIME = '%s' and PLANT_CODE = '%s' and ID = '%s'  ",
					Obj2.getString("publicMonth"), Obj2.getString("productType"), Obj2.getString("dia"), Obj2.getString("cycleNo"), Obj2.getString("startDate"), Obj2.getString("endDate"),
					model.getUserUpdate(), model.getDateUpdate(),
					Obj1.getString("importdatetime"), Obj1.getString("plantCode"), Obj1.getInt("id"));
			
			System.out.println(queryU);
				psmtU = conn.prepareStatement(queryU);
				psmtU.setQueryTimeout(5);
				psmtU.executeUpdate();

				json = "[{\"MSG\":\"Y\"}]";

				System.out.println("-------------- msg : " +json);
//			}

			// Commit
			conn.commit();

		} catch (Throwable e) {
			if (conn != null) {
				try {
					//Roll back
					conn.rollback();
				} catch (SQLException e1) {
					e1.printStackTrace();
				}
			}
			throw new RuntimeException(e);
		} finally {
			if (conn != null) {
				try {
					conn.close();
				} catch (SQLException e) {
					e.printStackTrace();
				}
			}
		}
		return json;
	}

	public String importTbppsm113Excel(TBPPSM113 model,JSONArray jsonArr) throws SQLException {
		final int DIVISOR = 500;
		Connection conn = null;
		PreparedStatement psmt = null;
		String res = "";
		

		try {

			String plantCode = model.getPlantCode();
			//取得連接
			conn = Druid.getConn();
			conn.setAutoCommit(false);  
			String query = String.format("   "
								+ " delete  from tbppsm113 where PLANT_CODE = '%s' "
						, plantCode);
			psmt = null;
			psmt = conn.prepareStatement(query);

			
			System.out.println(query);
			//刪除
			psmt.executeUpdate();

			String query1 =  "INSERT INTO tbppsm113 (PLANT_CODE, PUBLIC_MONTH, PRODUCT_TYPE,DIA, CYCLE_NO, START_DATE, END_DATE,USER_CREATE)  "
			+ "VALUES ( ?, ?, ? , ?, ?, ? , ? , ?)  ";

			psmt = conn.prepareStatement(query1);

			int rows =  jsonArr.length();
            int quotient = rows / DIVISOR;

			for(int i = 0 ; i< jsonArr.length() ; i++){
				
				JSONObject json = jsonArr.getJSONObject(i);
				psmt.setString(1,  plantCode);
				psmt.setString(2,  json.getString("publicMonth"));
				psmt.setString(3,  json.getString("productType"));
				psmt.setString(4,  json.getString("dia"));
				psmt.setString(5,  json.getString("cycleNo"));
				psmt.setString(6,  json.getString("startDate"));
				psmt.setString(7,  json.optString("endDate",null));
				psmt.setString(8,  model.getUserCreate());
				psmt.addBatch();

                if(i % DIVISOR == 0){
					System.out.println(query1);
                    psmt.executeBatch();
                    psmt.clearBatch();
                }
                else if(i / DIVISOR == quotient && i == rows){
					System.out.println("2");
                    psmt.executeBatch();
                    psmt.clearBatch();
                }
			
					
			}
			psmt.executeBatch();
			psmt.clearBatch();
			res = "[{\"MSG\":\"Y\"}]";
			// Commit
			conn.commit();  
			
		} catch (Throwable e) { 
			e.printStackTrace();
			if (conn != null) {
				try { 
					//Roll back 
					conn.rollback();
				} catch (SQLException e1) {
					e1.printStackTrace();
				}
			}
			throw new RuntimeException(e);
		} finally {
			if (conn != null) {
				try { 
					conn.close();
				} catch (SQLException e) {
					e.printStackTrace();
				}
			}
		}
		return res;

	}






	/**
	 * 401/405 autoCampaign 資料計算
	 * @param moEdition 
	 * @return
	 * @throws SQLException
	 */
	public List<TBPPSM119> getPreTBPPSM119Data(String userName, Integer day, String moEdition) throws SQLException {

		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		
		Connection conn = null;
		PreparedStatement psmt = null;
		ResultSet resultSet = null;
		List<TBPPSM119> ppsm119List = null;

		try {
			// 取得連接
			conn = Druid.getConn();

			// 預處理SQL
			psmt = null;
			psmt = conn.prepareStatement(getPreTbppsm119Sql(moEdition));
			psmt.setString(1,moEdition);
			psmt.setString(2,moEdition);

			// 查詢請求
			resultSet = psmt.executeQuery();
			ppsm119List = new ArrayList<TBPPSM119>();

			while (resultSet.next()) {
				TBPPSM119 ppsm119 = new TBPPSM119();
				ppsm119.setPlantCode("YS");
				ppsm119.setSetDay(day);
				ppsm119.setExportDateTime(sdf.format(new java.util.Date()));
				
				String MO_EDITION = resultSet.getString("MO_EDITION");
				ppsm119.setMoEdition(MO_EDITION);

				ppsm119.setUserCreate(userName);

				String EPST = resultSet.getString("EPST");
				ppsm119.setEpst(EPST);

				BigDecimal workTime401 = resultSet.getBigDecimal("workTime401").setScale(2, RoundingMode.HALF_UP);;
				ppsm119.setWorkTIme1(workTime401);

				BigDecimal workTime405 = resultSet.getBigDecimal("workTime405").setScale(2, RoundingMode.HALF_UP);;
				ppsm119.setWorkTIme2(workTime405);

				ppsm119List.add(ppsm119);
			}
			// Close
			resultSet.close();

		} catch (Throwable e) {
			e.printStackTrace();
			if (conn != null) {
				try {
					// Roll back
					conn.rollback();
				} catch (SQLException e1) {
//					log.error("error", e1);
				}
			}
			throw new RuntimeException(e);
		} finally {
			if (conn != null) {
				try {
					psmt.close();
					conn.close();
				} catch (SQLException e) {
					e.printStackTrace();
				}
			}
		}
		return ppsm119List;
	}

	/**
	 * 
	 */
	public void deleteTBPPSM119Data() {
	
		Connection conn = null;
		PreparedStatement psmt = null;

		try {
			// 取得連接
			conn = Druid.getConn();

			psmt = null;
			psmt = conn.prepareStatement(" delete from tbppsm119 ");

			psmt.executeUpdate();

		} catch (Throwable e) {
			e.printStackTrace();
			if (conn != null) {
				try {
					// Roll back
					conn.rollback();
				} catch (SQLException e1) {
					e1.printStackTrace();
				}
			}
			throw new RuntimeException(e);
		} finally {
			if (conn != null) {
				try {
					psmt.close();
					conn.close();
				} catch (SQLException e) {
					e.printStackTrace();
				}
			}
		}
		
	}
	
	/**
	 * 
	 * @param insertData
	 */
	public void insertTBPPSM119Data(List<TBPPSM119> insertData) {
	
		Connection connection = null;
		PreparedStatement pstmt = null;

		StringBuilder sbu = new StringBuilder();
		sbu.append(" INSERT INTO tbppsm119( ");
		sbu.append("     PLANT_CODE, ");
		sbu.append("     MO_EDITION, ");
		sbu.append("     EPST, ");
		sbu.append("     WORK_TIME1, ");
		sbu.append("     WORK_TIME2, ");
		sbu.append("     LEAST_TIME1, ");
		sbu.append("     LEAST_TIME2, ");
		sbu.append("     SET_DAY, ");
		sbu.append("     START_DATE, ");
		sbu.append("     END_DATE, ");
		sbu.append("     EXPORTDATETIME, ");
		sbu.append("     USER_CREATE ");
		sbu.append(" ) ");
		sbu.append(" VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ");

		try {

			connection = Druid.getConn();

			connection.setAutoCommit(false);

			pstmt = connection.prepareStatement(sbu.toString());

			for (TBPPSM119 data : insertData) {
				pstmt.setString(1, data.getPlantCode());
				pstmt.setString(2, data.getMoEdition());
				pstmt.setString(3, data.getEpst());
				pstmt.setBigDecimal(4, data.getWorkTIme1());
				pstmt.setBigDecimal(5, data.getWorkTIme2());
				pstmt.setDouble(6,data.getLeastTime1() != null ? data.getLeastTime1().doubleValue() : 0.0d);
				pstmt.setDouble(7,data.getLeastTime2() != null ? data.getLeastTime2().doubleValue() : 0.0d);
				pstmt.setInt(8,data.getSetDay());
				pstmt.setDate(9,data.getStartDate() != null ? 
						new java.sql.Date(DateUtil.dateStrParse(data.getStartDate(),"yyyy-MM-dd").getTime()) :
							null);
				pstmt.setDate(10,data.getEndDate() != null ? 
						new java.sql.Date(DateUtil.dateStrParse(data.getEndDate(),"yyyy-MM-dd").getTime()) :
							null);
				pstmt.setDate(11, data.getExportDateTime() != null ? 
						new java.sql.Date(DateUtil.dateStrParse(data.getExportDateTime(),"yyyy-MM-dd").getTime()) :
							null);
				pstmt.setString(12, data.getUserCreate());
				pstmt.addBatch();
			}

			pstmt.executeBatch();

			connection.commit();

		} catch (SQLException e) {
			log.error("preparedStatement error", e);
			try {
				connection.rollback();
			} catch (SQLException sqlException) {
				sqlException.printStackTrace();
			}
		} finally {
			if (pstmt != null) {
				try {
					pstmt.close();
				} catch (SQLException e) {
					log.debug("preparedStatement.close() fail.", e);
				}
			}

			if (connection != null) {
				try {
					connection.setAutoCommit(true);
					connection.close();
				} catch (SQLException e) {
					log.debug("connection.close() fail.", e);
				}
			}
		}
		
	}
	
	/**
	 * 
	 * @param preinsertData
	 * @param data 
	 * @param userName 
	 * @param moEdition 
	 * @return
	 */
	public List<TBPPSM119> calculate(List<TBPPSM119> preinsertData, String userName, Integer day, String moEdition) {

		Calendar cal = Calendar.getInstance();
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

		//按時間排序
		Collections.sort(preinsertData, new Comparator<TBPPSM119>() {
			public int compare(TBPPSM119 o1, TBPPSM119 o2) {
				DateUtil.isValidDateStr(o1.getEpst(),"yyyy-MM-dd");
				Long time1 = DateUtil.dateStrParse(o1.getEpst(), "yyyy-MM-dd").getTime();
				Long time2 = DateUtil.dateStrParse(o2.getEpst(), "yyyy-MM-dd").getTime();
				return time1.compareTo(time2);
			}
		});
		
		Map<String,TBPPSM119> timeMap = new HashMap<String,TBPPSM119>();
		
		//日期補齊
		for(int i = 0;i<=90;i++) {
			cal.setTime(DateUtil.dateStrParse(preinsertData.get(0).getEpst(), "yyyy-MM-dd"));
			cal.add(Calendar.DATE, i);
			if(cal.getTime().getTime() <= DateUtil.dateStrParse(preinsertData.get(preinsertData.size() - 1).getEpst(), "yyyy-MM-dd").getTime()) {
				timeMap.put(sdf.format(cal.getTime()), null);
			}else {
				break;
			}
		}

		for(String key : timeMap.keySet()) {
			Boolean contains = Boolean.FALSE;
			TBPPSM119 containObj = null;
			for(TBPPSM119 temp : preinsertData) {
				if(StringUtils.contains(temp.getEpst(), key)) {
					containObj = temp;
					contains = Boolean.TRUE;
					break;
				}
			}
			if(Boolean.TRUE.equals(contains)) {
				timeMap.put(key,containObj);
			}else {
				TBPPSM119 tbppsm119= new TBPPSM119();
				tbppsm119.setWorkTIme1(new BigDecimal(0.0d));
				tbppsm119.setWorkTIme2(new BigDecimal(0.0d));
				tbppsm119.setEpst(key);
				tbppsm119.setSetDay(day);
				tbppsm119.setPlantCode("YS");
				tbppsm119.setMoEdition(preinsertData.get(0).getMoEdition());
				timeMap.put(key,tbppsm119);
			}
		}
			
		List<TBPPSM119> insertData = new ArrayList<TBPPSM119>();
		for(String key : timeMap.keySet()) {
			insertData.add(timeMap.get(key));
		}
		
		Collections.sort(insertData, new Comparator<TBPPSM119>() {
			public int compare(TBPPSM119 o1, TBPPSM119 o2) {
				DateUtil.isValidDateStr(o1.getEpst(),"yyyy-MM-dd");
				Long time1 = DateUtil.dateStrParse(o1.getEpst(), "yyyy-MM-dd").getTime();
				Long time2 = DateUtil.dateStrParse(o2.getEpst(), "yyyy-MM-dd").getTime();
				return time1.compareTo(time2);
			}
		});
		
		int index = 0;
		double time2IndexLeast = 0.0d;
		double time2SumLeast = 0.0d;

		double time1IndexLeast = 0.0d;
		double time1SumLeast = 0.0d;
		
		for(TBPPSM119 temp : insertData) {
			if(index == 0) {
				
				time2IndexLeast = temp.getWorkTIme2().doubleValue();
				temp.setLeastTime2(temp.getWorkTIme2());
				time1IndexLeast = temp.getWorkTIme1().doubleValue();
				temp.setLeastTime1(temp.getWorkTIme1());

				temp.setStartDate(null);
				temp.setEndDate(null);
				
				index++;
			} else if(time2IndexLeast > day) {
				
				time1SumLeast = time1SumLeast + temp.getWorkTIme1().doubleValue();
				BigDecimal least1 = new BigDecimal(time1SumLeast).setScale(2, RoundingMode.HALF_UP);
				temp.setLeastTime1(least1);
				time1IndexLeast = least1.doubleValue();
				
				//可扣的最後一筆才要計算開始結束日
				if((time2IndexLeast - day) < day) {
					
					temp.setEndDate(temp.getEpst());
					
					cal.setTime(DateUtil.dateStrParse(temp.getEpst(), "yyyy-MM-dd"));
					cal.add(Calendar.DATE, temp.getLeastTime1().intValue() * -1);
					temp.setStartDate(sdf.format(cal.getTime()));
					
				}else {
					
					temp.setStartDate(null);
					temp.setEndDate(null);
					
				}
				
				//先計算日期在計算時間
				time2SumLeast = time2SumLeast + temp.getWorkTIme2().doubleValue();
				BigDecimal least = new BigDecimal(time2IndexLeast - day).setScale(2, RoundingMode.HALF_UP);			// 取得剩餘天數
				temp.setLeastTime2(least);
				time2IndexLeast = least.doubleValue();
				
				
			} else {
				if((time2IndexLeast + time2SumLeast) > day) {
					BigDecimal least = new BigDecimal(time2IndexLeast + time2SumLeast - day).setScale(2, RoundingMode.HALF_UP);
					temp.setLeastTime2(least);
					time2IndexLeast = least.doubleValue();
					time2SumLeast = temp.getWorkTIme2().doubleValue();
					
					BigDecimal least1 = new BigDecimal(time1IndexLeast + time1SumLeast - day).setScale(2, RoundingMode.HALF_UP);
					temp.setLeastTime1(least1);
					time1IndexLeast = least1.doubleValue();
					time1SumLeast = temp.getWorkTIme1().doubleValue();
					
					temp.setStartDate(null);
					temp.setEndDate(null);
					
				}else {
					
					time2SumLeast = time2SumLeast + time2IndexLeast;
					time2IndexLeast = temp.getWorkTIme2().doubleValue();
					temp.setLeastTime2(null);
					
					time1SumLeast = time1SumLeast + time1IndexLeast;
					time1IndexLeast = temp.getWorkTIme1().doubleValue();
					temp.setLeastTime1(null);
					
					temp.setStartDate(null);
					temp.setEndDate(null);
					
				}
			}
		}
		
		return insertData;
	}
	
	/**
	 * getPreTbppsm119Sql 取得基礎資料
	 * @param moEdition 
	 * @return
	 */
	private String getPreTbppsm119Sql(String moEdition) {
		StringBuilder sbu = new StringBuilder();
		sbu.append(" select MO_EDITION, substring(t.EPST, 1, 10) EPST, sum(workTime401)/1440 workTime401, sum(workTime405)/1440/4 workTime405  \n");
		sbu.append(" from (  \n");
		sbu.append("      select a.MO_EDITION, a.EPST, sum(a.WORKING_HOURS) workTime401, sum(b.NEXT_WORKING_HOURS) workTime405  \n");
		sbu.append("      from (  \n");
		sbu.append(" 	        select MO_EDITION, ID_NO, ROUTING_SEQ, SCH_SHOP_CODE, BEST_MACHINE, WORKING_HOURS, EPST, NEXT_SCH_SHOP_CODE, NEXT_ROUTING_SEQ  \n ");
		sbu.append(" 	        from mo_view  \n");
		sbu.append(" 	        where MO_EDITION = ? and SCH_SHOP_CODE ='401' and BEST_MACHINE ='TC' and NEXT_SCH_SHOP_CODE ='405') a  \n");
		sbu.append("      left join (  \n");
		sbu.append(" 	        select MO_EDITION, ID_NO, ROUTING_SEQ, BEST_MACHINE NEXT_BEST_MACHINE, WORKING_HOURS NEXT_WORKING_HOURS, EPST NEXT_EPST \n ");
		sbu.append(" 	        from mo_view  \n");
		sbu.append(" 	        where MO_EDITION = ? and SCH_SHOP_CODE ='405' and BEST_MACHINE in ('A4','A6','A8','CF0') ) b  \n");
		sbu.append(" 	  on a.MO_EDITION=b.MO_EDITION and a.ID_NO=b.ID_NO and a.NEXT_ROUTING_SEQ = b.ROUTING_SEQ   \n");
		sbu.append(" 	  group by a.MO_EDITION, a.EPST, a.SCH_SHOP_CODE, a.NEXT_SCH_SHOP_CODE  \n");
		sbu.append(" ) t  \n");
		sbu.append(" where t.EPST is not null and t.EPST > date_sub(curdate(),interval 1 day) \n");
		sbu.append(" group by t.MO_EDITION, substring(t.EPST, 1, 10)  \n");
		sbu.append(" order by t.EPST  \n");
		return sbu.toString();
	}

}
