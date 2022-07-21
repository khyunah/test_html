let commu = {
	
	init: function(){
		
		$(".commu-detail-btn-reply-update").bind('click', () => {
			this.updateBtnReply();
		});

		$(document).on('click', ".commu-detail-btn-reply-update-finish", function(){
			commu.finishUpdateReply();
		});
	},
	
	// 댓글쓰기
	insertReply: function(communityBoardId, userId) {

		let data = {
			content: $(`#commu-input-reply-${communityBoardId}`).val(),
		}

		$.ajax({
			type: "POST",
			url: `/community/reply-insert/${communityBoardId}`,
			data: JSON.stringify(data),
			contentType: "application/json; charset=utf-8",
			dataType: "json"
		}).done(function(response){
			console.log("성공");
			console.log(response);
			addReply(response.data, userId, communityBoardId);
		}).fail(function(error){
			console.log("실패");
		});
	},
	
	// 댓글 삭제
	deleteReply: function(){
		let id = $("#replyId").val();
		
		$.ajax({
			type: "GET",
			url: `/community/reply-delete/${id}`,
			dataType: "json"
		}).done(function(response){
			console.log("성공");
			// 삭제 성공하면 해당 html 삭제해주기 비동기방식으로 해보기 
			removeReply(id);
		}).fail(function(error){
			console.log("실패");
		})
	},
	
	// 댓글 수정버튼 클릭시 
	updateBtnReply: function(){
		changeReply();
	},
	
	// 댓글 수정 완료시 
	finishUpdateReply: function(){
		console.log("완료버튼 누름");
		let data = {
			//id: $("#replyId").val(),
			id: 4,
			content: $(".commu-detail-reply-content").text(),
		}
		console.log(data.content);
		$.ajax({
			type: "POST",
			url: `/community/reply-update`,
			data: JSON.stringify(data),
			contentType: "application/json; charset=utf-8",
			dataType: "json"
		}).done(function(response){
			console.log("성공");
			console.log(response);

		}).fail(function(error){
			console.log("실패");
		});
	},
	
	// 좋아요
	communityLike: function(communityBoardId, likeCount){

		$.ajax({
			type: "GET",
			url: `/community/check-like/${communityBoardId}`,
			dataType: "json"
		}).done(function(response){
			changeLikeIcon(response, communityBoardId, likeCount);
		}).fail(function(error){
			alert('서버오류 ! 다시 실행해주세요.');
		});
	}, 

}

// 댓글 추가 
function addReply(reply, userId, communityBoardId){
	let childReply = `
		<div id="commu-reply-${reply.id}">
			<input id="replyId" type="hidden" value="${reply.id}"/>
			<div class="commu-detail-reply-firstline-container">
		      <span class="commu-detail-reply-user commu-detail-reply-text">${reply.user.username}</span>
		      <div id="commu-detail-reply-btn-box">
              	<c:if test="${reply.user.id == userId}">
              		<button onclick="commu.updateBtnReply()" class="commu-detail-btn-reply-update commu-detail-btn-reply">
	                  수정
	                </button>
	                <button onclick="commu.deleteReply()" class="commu-detail-btn-reply-delete commu-detail-btn-reply">
	                  삭제
	                </button>
              	</c:if>
		      </div>
		    </div>
		    <div id="commu-detail-reply-content-box">
		    	<textarea class="commu-detail-reply-content commu-detail-reply-text" readonly>${reply.content}</textarea>
		    </div>
		</div>
	`;
	
	$(".commu-detail-reply-container").prepend(childReply);
	$(`#commu-input-reply-${communityBoardId}`).val("");
}

function removeReply(replyId){
	
	$(`#commu-reply-`+ replyId).remove();
}

// 댓글 수정버튼 클릭시 
function changeReply(){
	let finishBtn = `
		<button class="commu-detail-btn-reply-update-finish commu-detail-btn-reply">
          완료
        </button>
	`;
	
	$("#commu-detail-reply-btn-box").prepend(finishBtn);
	document.getElementById("commu-detail-reply-content-box").innerHTML =
		'<textarea id="commu-detail-reply-content" class="commu-detail-reply-content commu-detail-reply-text">댓글 원문 옮겨주기</textarea>';
}

// 좋아요 아이콘 변경 함수
function changeLikeIcon(response, communityBoardId,  likeCount){
	if(response.data == null){
		likeCount--;
		document.getElementById(`commu-icon-box-${communityBoardId}`).innerHTML =
			`
				<div onclick="commu.communityLike(${communityBoardId}, ${likeCount})">

	        		<i style="color: black" id="before-like" class="fa-regular fa-heart fa-lg"></i>
	
					<span id="likeCount-${communityBoardId}" class="commu-social-span-goodlook-count commu-social-text">${likeCount}</span>
	            </div>
			`;

	} else {
		likeCount++;
		document.getElementById(`commu-icon-box-${communityBoardId}`).innerHTML =
			`
				<div onclick="commu.communityLike(${communityBoardId}, ${likeCount})">
	
	        		<i class="fa-solid fa-heart fa-lg" style="color: rgb(240, 81, 115)"></i>

					<span id="likeCount-${communityBoardId}" class="commu-social-span-goodlook-count commu-social-text">${likeCount}</span>
	            </div>
			`;
	}
}

commu.init();
