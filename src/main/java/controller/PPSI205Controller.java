package controller;


import com.google.gson.Gson;

import model.*;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONObject;
import services.Bar.PPSI205Service;
import services.Bar.PPSR308Service;
import utils.result.Result;
import utils.result.ResultCodeConstant;

import javax.ws.rs.*;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;


@Path("/FCP/I205")
public class PPSI205Controller {

	private static Logger log = Logger.getLogger(PPSI205Controller.class);
	
	PPSI205Service PPSI205 = new PPSI205Service();
	public PPSI205Controller() {
		// TODO Auto-generated constructor stub
	} 
	
	@GET 
	public String HelloAliens() {   
		return "/FCP INPUT API working";
	}



	


	
	// Get 尺寸優先順序 420/430 (Tbppsm101)
	// http://localhost:8080/pps/rest/FCP/I205/getTbppsm101List/YS
	@GET
	@Path("/getTbppsm101List/{_plantCode}")
	@Produces("application/json")
	public String getTbppsm101List(@PathParam("_plantCode") String _plantCode) throws SQLException, InterruptedException, ExecutionException {
		CompletableFuture<String> future = CompletableFuture.supplyAsync(() -> {
			try {
				List<TBPPSM101> PPSM101List = PPSI205.getTbppsm101List(_plantCode);
				if (PPSM101List == null) {
					return "PPSM101List NO Not Found!...";
				} else {
					String json = new Gson().toJson(PPSM101List);
					return json;
				}
			} catch (SQLException e) {
				e.printStackTrace();
			}

			return "";
		});
		String result = future.get();
		return result;
	}



	// Get COMPAIGN 優先順序 401 (Tbppsm102)
	// http://localhost:8080/pps/rest/FCP/I205/getTbppsm102List/YS
	@GET
	@Path("/getTbppsm102List/{_plantCode}")
	@Produces("application/json")
	public String getTbppsm102List(@PathParam("_plantCode") String _plantCode) throws SQLException, InterruptedException, ExecutionException {
		CompletableFuture<String> future = CompletableFuture.supplyAsync(() -> {
			try {
				List<TBPPSM102> PPSM102List = PPSI205.getTbppsm102List(_plantCode);
				if (PPSM102List == null) {
					return "PPSM102List NO Not Found!...";
				} else {
					String json = new Gson().toJson(PPSM102List);
					return json;
				}
			} catch (SQLException e) {
				e.printStackTrace();
			}

			return "";
		});
		String result = future.get();
		return result;
	}

	// Get COMPAIGN 優先順序 401 (Tbppsm102)
	// http://localhost:8080/pps/rest/FCP/I205/getTbppsm102List/YS
	@GET
	@Path("/getTbppsm102ListAll/{_plantCode}")
	@Produces("application/json")
	public String getTbppsm102ListAll(@PathParam("_plantCode") String _plantCode) throws SQLException, InterruptedException, ExecutionException {
		CompletableFuture<String> future = CompletableFuture.supplyAsync(() -> {
			try {
				List<TBPPSM102> PPSM102List = PPSI205.getTbppsm102List(_plantCode);
				if (PPSM102List == null) {
					return "PPSM102List NO Not Found!...";
				} else {
					String json = new Gson().toJson(PPSM102List);
					return json;
				}
			} catch (SQLException e) {
				e.printStackTrace();
			}

			return "";
		});
		String result = future.get();
		return result;
	}
	
		// Get COMPAIGN 優先順序 401 (Tbppsm102)
	// http://localhost:8080/pps/rest/FCP/I205/getTbppsm102List/YS
	@GET
	@Path("/getTbppsm113List/{_plantCode}")
	@Produces("application/json")
	public String getTbppsm113List(@PathParam("_plantCode") String _plantCode) throws SQLException, InterruptedException, ExecutionException {
		CompletableFuture<String> future = CompletableFuture.supplyAsync(() -> {
			try {
				List<TBPPSM113> PPSM113List = PPSI205.getTbppsm113List(_plantCode);
				if (PPSM113List == null) {
					return "PPSM113List NO Not Found!...";
				} else {
					String json = new Gson().toJson(PPSM113List);
					return json;
				}
			} catch (SQLException e) {
				e.printStackTrace();
			}

			return "";
		});
		String result = future.get();
		return result;
	}

	@GET
	@Path("getTbppsm119ListAll/{_moEdition}")
	@Produces("application/json")
	public String getTbppsm119ListAll(@PathParam("_moEdition") String _moEdition) throws SQLException, InterruptedException, ExecutionException {
		CompletableFuture<String> future = CompletableFuture.supplyAsync(() -> {
			try {
				List<TBPPSM119> PPSM119List = PPSI205.getTbppsm119ListAll(_moEdition);
				if (PPSM119List == null) {
					return "PPSM119List NO Not Found!...";
				} else {
					String json = new Gson().toJson(PPSM119List);
					return json;
				}
			} catch (SQLException e) {
				e.printStackTrace();
			}

			return "";
		});
		String result = future.get();
		return result;
	}

	// 401 Campaign MO_EDITION
	@POST
	@Path("/getTbppsm119VerList")
	@Produces("application/json")
	public List<VerList> getTbppsm119VerList(String paramData) throws SQLException {

		TBPPSM119 searchData = new TBPPSM119();
		PPSI205Service ppsi205 = new PPSI205Service();
		List<VerList> result = ppsi205.getTbppsm119VerList(searchData);

		return result;
	}



	// importI205Excel 401 優先順序EXCEL匯入
	// http://localhost:8080/pps/rest/FCP/I205/importI205Excel
	@POST
	@Consumes("application/json")
	@Path("/importI205Excel")
	public String importI205Excel(String _json) throws SQLException, InterruptedException, ExecutionException {
		 
		CompletableFuture<String> future = CompletableFuture.supplyAsync(() -> {
			try {
				JSONObject JsonObj = new JSONObject(_json);
				TBPPSM101 model1 = new TBPPSM101();
				TBPPSM102 model2 = new TBPPSM102();
				TBPPSM113 model3 = new TBPPSM113();
				String json = "";
				JSONArray Array1 = JsonObj.getJSONArray("EXCELDATA");		// excel 匯入資料

				if(JsonObj.getString("NOWTABS").equals("1")) {
					model1.setPLANT_CODE(JsonObj.getString("PLANT_CODE"));
					model1.setUSER_CREATE(JsonObj.getString("USERCODE"));
					json = PPSI205.importI205_1Excel(model1, Array1);
				} else if(JsonObj.getString("NOWTABS").equals("2")) {
					model2.setPLANT_CODE(JsonObj.getString("PLANT_CODE"));
					model2.setUSER_CREATE(JsonObj.getString("USERCODE"));
					json = PPSI205.importI205_2Excel(model2, Array1);
				}else if(JsonObj.getString("NOWTABS").equals("3")){
					model3.setPlantCode(JsonObj.getString("PLANT_CODE"));
					model3.setUserCreate(JsonObj.getString("USERCODE"));
					json = PPSI205.importTbppsm113Excel(model3,Array1);
				}
				return json;
				
			} catch (SQLException e) {
				e.printStackTrace();
			}

			return "";
		});

		String result = future.get();
		return result;
	}




	// importCompaign 上傳到compaign 資料到 ppsinptb16
	// http://localhost:8080/pps/rest/FCP/I205/importCompaign
	@POST
	@Consumes("application/json")
	@Path("/importCompaign")
	public String importCompaign(String _json) throws SQLException, InterruptedException, ExecutionException {

		CompletableFuture<String> future = CompletableFuture.supplyAsync(() -> {
			try {
				JSONObject JsonObj = new JSONObject(_json);
				TBPPSM102 model = new TBPPSM102();
				String json = "";
				JSONArray array = JsonObj.getJSONArray("dataList");
				model.setPLANT_CODE(JsonObj.getString("PLANT_CODE"));
				model.setUSER_UPDATE(JsonObj.getString("USERCODE"));
				json = PPSI205.importCompaign(model, array);
				return json;

			} catch (SQLException e) {
				e.printStackTrace();
			}

			return "";
		});

		String result = future.get();
		return result;
	}


	// upd updCalendarData
	// http://localhost:8080/pps/rest/FCP/I205/upd102ListData
	@POST
	@Consumes("application/json")
	@Path("/upd102ListData")
	public String upd102ListData(String _json) throws SQLException, InterruptedException, ExecutionException {

		CompletableFuture<String> future = CompletableFuture.supplyAsync(() -> {
			try {
				JSONObject JsonObj = new JSONObject(_json);
				TBPPSM102 model = new TBPPSM102();

				JSONObject Obj1 = JsonObj.getJSONObject("OLDLIST");		// 原資料列
				JSONObject Obj2 = JsonObj.getJSONObject("NEWList");		// 新資料列
				model.setUSER_UPDATE(JsonObj.getString("USERCODE"));
				model.setDATE_UPDATE(JsonObj.getString("DATETIME"));

				String json = PPSI205.upd102ListData(model, Obj1, Obj2);
				return json;
			} catch (SQLException e) {
				e.printStackTrace();
			}

			return "";
		});

		String result = future.get();
		return result;
	}


	
	

	// upd updCalendarData
	// http://localhost:8080/pps/rest/FCP/I205/upd102ListData
	@POST
	@Consumes("application/json")
	@Path("/upd113ListData")
	public String upd113ListData(String _json) throws SQLException, InterruptedException, ExecutionException {

		CompletableFuture<String> future = CompletableFuture.supplyAsync(() -> {
			try {
				JSONObject JsonObj = new JSONObject(_json);
				TBPPSM113 model = new TBPPSM113();

				JSONObject Obj1 = JsonObj.getJSONObject("OLDLIST");		// 原資料列
				JSONObject Obj2 = JsonObj.getJSONObject("NEWList");		// 新資料列
				model.setUserUpdate(JsonObj.getString("USERCODE"));
				model.setDateUpdate(JsonObj.getString("DATETIME"));

				String json = PPSI205.upd113ListData(model, Obj1, Obj2);
				return json;
			} catch (SQLException e) {
				e.printStackTrace();
			}

			return "";
		});

		String result = future.get();
		return result;
	}	

	@POST
	@Path("/converTBPPSM119Data")
	@Produces("application/json")
	public synchronized static Result<Object> converTBPPSM119Data(String parameData)
			throws SQLException, InterruptedException, ExecutionException {

		String userName = "";
		Integer day = 0;
		String moEdition = "";

		if(StringUtils.isNotBlank(parameData)) {
			JSONObject jsonParam = new JSONObject(parameData);
			if(Boolean.FALSE.equals(jsonParam.isNull("userName"))) {
				userName = jsonParam.getString("userName");
			}
			if(Boolean.FALSE.equals(jsonParam.isNull("day"))) {
				day = jsonParam.getInt("day");
			}
			if(Boolean.FALSE.equals(jsonParam.isNull("moEdition"))) {
				moEdition = jsonParam.getString("moEdition");
			}
		}
		
		Result<Object> result = new Result<Object>();
		result.setCode(ResultCodeConstant.SuccessCode);

		try {

			PPSI205Service ppsi205 = new PPSI205Service();
			List<TBPPSM119> preinsertData = ppsi205.getPreTBPPSM119Data(userName,day,moEdition);
			List<TBPPSM119> insertData = ppsi205.calculate(preinsertData,userName,day,moEdition);
			if (CollectionUtils.isNotEmpty(insertData)) {
				// 先刪除
				ppsi205.deleteTBPPSM119Data();
				// 在新增
				ppsi205.insertTBPPSM119Data(insertData);
			}

		} catch (Exception e) {
			log.error("error", e);
			result.setCode(ResultCodeConstant.ErrorCode);
		}

		return result;

	}
	
	
	
}
