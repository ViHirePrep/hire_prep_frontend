const ReadmePage = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white shadow-xl rounded-lg p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                        HirePrep – Nền tảng luyện phỏng vấn bằng AI
                    </h1>

                    <div className="prose max-w-none">
                        <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
                            1. Mô tả sản phẩm
                        </h2>
                        <p className="text-gray-700 mb-4">
                            HirePrep là một nền tảng luyện phỏng vấn sử dụng AI,
                            giúp ứng viên mô phỏng trải nghiệm phỏng vấn thực tế
                            dựa trên Job Description (JD) cụ thể. Hệ thống tự
                            động tạo câu hỏi phù hợp với level, vị trí chuyên
                            môn và yêu cầu công việc, sau đó chấm điểm, phân
                            tích câu trả lời và đưa ra feedback chi tiết để
                            người dùng cải thiện kỹ năng phỏng vấn.
                        </p>
                        <p className="text-gray-700 mb-4">
                            HirePrep có thể được sử dụng cho:
                        </p>
                        <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                            <li>Cá nhân tự luyện phỏng vấn</li>
                            <li>Test ứng viên nội bộ</li>
                            <li>Chuẩn bị trước các buổi phỏng vấn thật</li>
                        </ul>
                        <p className="text-gray-700 mb-4">Mục tiêu chính:</p>
                        <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                            <li>Tạo trải nghiệm phỏng vấn sát thực tế</li>
                            <li>
                                Giúp candidate nhận biết điểm mạnh – điểm yếu
                            </li>
                            <li>
                                Cung cấp đáp án chuẩn và hướng cải thiện rõ ràng
                            </li>
                        </ul>

                        <div className="border-t border-gray-200 my-6"></div>

                        <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
                            2. Các tính năng cần có
                        </h2>
                        <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                            <li>Đăng nhập qua Google</li>
                            <li>
                                Gửi Job Description (JD)
                                <ul className="list-circle pl-6 mt-2">
                                    <li>Nhập trực tiếp nội dung JD</li>
                                    <li>Hoặc upload file DOC / PDF</li>
                                    <li>Có giới hạn độ dài</li>
                                </ul>
                            </li>
                            <li>
                                Chọn level
                                <ul className="list-circle pl-6 mt-2">
                                    <li>Intern</li>
                                    <li>Fresher</li>
                                    <li>Senior</li>
                                    <li>Expert</li>
                                </ul>
                            </li>
                            <li>
                                Chọn mảng chuyên môn
                                <ul className="list-circle pl-6 mt-2">
                                    <li>Backend</li>
                                    <li>Frontend</li>
                                    <li>Full-stack</li>
                                    <li>DevOps</li>
                                </ul>
                            </li>
                            <li>
                                Test thiết bị
                                <ul className="list-circle pl-6 mt-2">
                                    <li>Test microphone</li>
                                    <li>Test camera</li>
                                </ul>
                            </li>
                            <li>
                                Cấu hình buổi phỏng vấn
                                <ul className="list-circle pl-6 mt-2">
                                    <li>Chọn số câu hỏi hoặc thời gian</li>
                                    <li>Tối đa 30 câu hỏi</li>
                                </ul>
                            </li>
                            <li>
                                Summary
                                <ul className="list-circle pl-6 mt-2">
                                    <li>Tổng hợp các điểm user cần lưu ý</li>
                                </ul>
                            </li>
                            <li>
                                Phân tích câu trả lời
                                <ul className="list-circle pl-6 mt-2">
                                    <li>Chỉ rõ đúng / sai cho từng câu</li>
                                    <li>Giải thích lý do</li>
                                    <li>Cung cấp đáp án chuẩn</li>
                                </ul>
                            </li>
                            <li>
                                User feedback
                                <ul className="list-circle pl-6 mt-2">
                                    <li>Cho phép user đánh giá và góp ý</li>
                                </ul>
                            </li>
                            <li>
                                Activity log
                                <ul className="list-circle pl-6 mt-2">
                                    <li>Ghi lại toàn bộ hành động của user</li>
                                </ul>
                            </li>
                        </ul>

                        <div className="border-t border-gray-200 my-6"></div>

                        <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
                            3. Giai đoạn 1: Xây MVP
                        </h2>
                        <p className="text-gray-700 mb-4">
                            Mục tiêu: ra sản phẩm chạy được nhanh nhất, có thể
                            dùng nội bộ hoặc test với một số candidate.
                        </p>

                        <h3 className="text-xl font-semibold text-gray-700 mt-4 mb-2">
                            3.1 Thiết kế database schema cơ bản
                        </h3>
                        <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                            <li>
                                Users
                                <ul className="list-circle pl-6 mt-2">
                                    <li>google_id</li>
                                    <li>email</li>
                                    <li>name</li>
                                    <li>role (recruiter / candidate)</li>
                                </ul>
                            </li>
                            <li>
                                JobDescriptions
                                <ul className="list-circle pl-6 mt-2">
                                    <li>jd_text</li>
                                    <li>file_url</li>
                                    <li>uploaded_by</li>
                                    <li>created_at</li>
                                </ul>
                            </li>
                            <li>
                                InterviewSessions
                                <ul className="list-circle pl-6 mt-2">
                                    <li>session_id</li>
                                    <li>jd_id</li>
                                    <li>level</li>
                                    <li>tech_stack</li>
                                    <li>num_questions</li>
                                    <li>time_limit</li>
                                    <li>status</li>
                                    <li>created_by</li>
                                    <li>invited_candidate_email</li>
                                    <li>unique_link</li>
                                </ul>
                            </li>
                            <li>
                                Answers
                                <ul className="list-circle pl-6 mt-2">
                                    <li>session_id</li>
                                    <li>question_id</li>
                                    <li>candidate_answer_text / video_url</li>
                                    <li>score</li>
                                    <li>feedback</li>
                                </ul>
                            </li>
                            <li>
                                ActivityLogs
                                <ul className="list-circle pl-6 mt-2">
                                    <li>user_id</li>
                                    <li>action</li>
                                    <li>timestamp</li>
                                    <li>details</li>
                                </ul>
                            </li>
                            <li>
                                InterviewSummary
                                <ul className="list-circle pl-6 mt-2">
                                    <li>
                                        Tổng hợp kết quả phỏng vấn của mỗi
                                        session
                                    </li>
                                </ul>
                            </li>
                        </ul>

                        <h3 className="text-xl font-semibold text-gray-700 mt-4 mb-2">
                            3.2 Xây backend cơ bản
                        </h3>
                        <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                            <li>Đăng nhập Google OAuth</li>
                            <li>
                                Upload JD (PDF/DOC) → extract text
                                <ul className="list-circle pl-6 mt-2">
                                    <li>Sử dụng pdf-parse, docx-parser</li>
                                    <li>Giới hạn {'<'} 5000 từ</li>
                                </ul>
                            </li>
                            <li>
                                Tạo interview session
                                <ul className="list-circle pl-6 mt-2">
                                    <li>
                                        Chọn level (intern / fresher / senior /
                                        expert)
                                    </li>
                                    <li>
                                        Chọn tech stack (backend / frontend /
                                        fullstack / devops)
                                    </li>
                                    <li>
                                        Chọn số câu hỏi (5–30) hoặc thời gian
                                    </li>
                                </ul>
                            </li>
                            <li>
                                Tích hợp AI để generate câu hỏi
                                <ul className="list-circle pl-6 mt-2">
                                    <li>
                                        Sử dụng Grok, GPT-4o, Claude hoặc Gemini
                                    </li>
                                    <li>
                                        Input:
                                        <ul className="list-square pl-6 mt-2">
                                            <li>JD text</li>
                                            <li>Level</li>
                                            <li>Tech stack</li>
                                            <li>Số câu hỏi</li>
                                        </ul>
                                    </li>
                                    <li>
                                        Output:
                                        <ul className="list-square pl-6 mt-2">
                                            <li>Danh sách câu hỏi</li>
                                            <li>Đáp án chuẩn (ẩn)</li>
                                        </ul>
                                    </li>
                                </ul>
                            </li>
                            <li>Lưu câu hỏi và đáp án chuẩn vào database</li>
                        </ul>

                        <h3 className="text-xl font-semibold text-gray-700 mt-4 mb-2">
                            3.3 Frontend cho Candidate
                        </h3>
                        <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                            <li>
                                Verify và test mic + camera bằng WebRTC
                                (getUserMedia)
                            </li>
                            <li>
                                Giao diện phỏng vấn
                                <ul className="list-circle pl-6 mt-2">
                                    <li>Hiển thị từng câu hỏi</li>
                                    <li>
                                        Record video/audio bằng MediaRecorder
                                    </li>
                                    <li>
                                        Hoặc trả lời bằng text / code editor nếu
                                        cần
                                    </li>
                                </ul>
                            </li>
                            <li>Countdown timer</li>
                            <li>Progress bar</li>
                            <li>Submit khi hết thời gian hoặc bấm Finish</li>
                        </ul>

                        <h3 className="text-xl font-semibold text-gray-700 mt-4 mb-2">
                            3.4 Sau khi candidate hoàn thành
                        </h3>
                        <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                            <li>Tự động transcribe video/audio → text</li>
                            <li>
                                AI chấm điểm
                                <ul className="list-circle pl-6 mt-2">
                                    <li>Giải thích đúng / sai cho từng câu</li>
                                    <li>Cung cấp đáp án chuẩn</li>
                                </ul>
                            </li>
                            <li>
                                Generate summary
                                <ul className="list-circle pl-6 mt-2">
                                    <li>Điểm mạnh</li>
                                    <li>Điểm yếu</li>
                                    <li>Điểm tổng</li>
                                </ul>
                            </li>
                        </ul>

                        <div className="border-t border-gray-200 my-6"></div>

                        <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
                            4. Những điểm chưa hoàn thiện ở Giai đoạn 1
                        </h2>
                        <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                            <li>Google Auth chưa hỗ trợ revoke token</li>
                            <li>Chưa hoàn thiện upload file JD</li>
                            <li>
                                Security chưa được rà soát đầy đủ
                                <ul className="list-circle pl-6 mt-2">
                                    <li>
                                        Hiện tại đã có:
                                        <ul className="list-square pl-6 mt-2">
                                            <li>
                                                Next.js giúp tránh XSS cơ bản
                                            </li>
                                            <li>
                                                Prisma giúp tránh DB injection
                                            </li>
                                            <li>
                                                CORS, rate limit, JWT guard cho
                                                một số API
                                            </li>
                                        </ul>
                                    </li>
                                    <li>
                                        Chưa có:
                                        <ul className="list-square pl-6 mt-2">
                                            <li>Giới hạn kích thước input</li>
                                            <li>
                                                Chưa đảm bảo guard hết các edge
                                                case
                                            </li>
                                        </ul>
                                    </li>
                                </ul>
                            </li>
                            <li>
                                Dark mode bị lỗi
                                <ul className="list-circle pl-6 mt-2">
                                    <li>Chưa finetune UI</li>
                                    <li>
                                        Nếu OS default là dark mode thì không
                                        chuyển về light mode được
                                    </li>
                                </ul>
                            </li>
                            <li>
                                Tên AI model trong database chưa rõ
                                <ul className="list-circle pl-6 mt-2">
                                    <li>Hiện chỉ dùng chat GPT 4</li>
                                    <li>
                                        Database hiển thị chung, cần đưa về tên
                                        models cụ thể
                                    </li>
                                </ul>
                            </li>
                            <li>
                                Nhiều chỗ còn hard-code
                                <ul className="list-circle pl-6 mt-2">
                                    <li>
                                        Ví dụ: language → nên đưa vào table hoặc
                                        constants
                                    </li>
                                </ul>
                            </li>
                            <li>
                                Prompt còn thô sơ
                                <ul className="list-circle pl-6 mt-2">
                                    <li>Chưa optimize</li>
                                    <li>Câu hỏi generate chưa sát thực tế</li>
                                </ul>
                            </li>
                            <li>Chỉ hỗ trợ candidate trả lời dạng text</li>
                            <li>Flow EvaluateInterview chưa được optimize</li>
                        </ul>

                        <div className="border-t border-gray-200 my-6"></div>

                        <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
                            5. Giai đoạn 2: Phát triển
                        </h2>

                        <h3 className="text-xl font-semibold text-gray-700 mt-4 mb-2">
                            5.1 Anti-cheating cơ bản
                        </h3>
                        <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                            <li>Bắt buộc fullscreen</li>
                            <li>Detect tab switch / window blur</li>
                            <li>Disable copy – paste</li>
                            <li>Disable link sau khi đã được sử dụng</li>
                        </ul>

                        <h3 className="text-xl font-semibold text-gray-700 mt-4 mb-2">
                            5.2 Cải thiện báo cáo
                        </h3>
                        <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                            <li>
                                Export PDF đẹp
                                <ul className="list-circle pl-6 mt-2">
                                    <li>Điểm số</li>
                                    <li>Highlight</li>
                                    <li>Matching với JD</li>
                                </ul>
                            </li>
                            <li>
                                Tổng điểm + phân loại
                                <ul className="list-circle pl-6 mt-2">
                                    <li>Technical</li>
                                    <li>Problem-solving</li>
                                    <li>Communication</li>
                                </ul>
                            </li>
                        </ul>

                        <h3 className="text-xl font-semibold text-gray-700 mt-4 mb-2">
                            5.3 Bảo mật & tuân thủ
                        </h3>
                        <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                            <li>Consent checkbox trước khi record</li>
                            <li>
                                Tự động xóa video sau 30 ngày (hoặc tùy chọn)
                            </li>
                            <li>
                                Encryption file lưu trữ (S3 + server-side
                                encryption)
                            </li>
                        </ul>

                        <h3 className="text-xl font-semibold text-gray-700 mt-4 mb-2">
                            5.4 Tối ưu trải nghiệm
                        </h3>
                        <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                            <li>
                                Virtual interviewer
                                <ul className="list-circle pl-6 mt-2">
                                    <li>Thêm âm thanh</li>
                                    <li>
                                        Thêm hình ảnh để tạo cảm giác phỏng vấn
                                        thật
                                    </li>
                                </ul>
                            </li>
                            <li>Responsive mobile</li>
                            <li>Email notification (SMTP)</li>
                            <li>
                                Hỗ trợ tiếng Việt + tiếng Anh (UI localization)
                            </li>
                            <li>
                                Candidate dashboard
                                <ul className="list-circle pl-6 mt-2">
                                    <li>Xem activity</li>
                                    <li>Xem lịch sử mock interview</li>
                                </ul>
                            </li>
                            <li>
                                Cho candidate đánh giá
                                <ul className="list-circle pl-6 mt-2">
                                    <li>1–5 sao</li>
                                    <li>Feedback text</li>
                                </ul>
                            </li>
                        </ul>

                        <h3 className="text-xl font-semibold text-gray-700 mt-4 mb-2">
                            5.5 Mở rộng
                        </h3>
                        <p className="text-gray-700 mb-4">
                            Mở rộng sang các lĩnh vực khác ngoài IT
                        </p>

                        <h3 className="text-xl font-semibold text-gray-700 mt-4 mb-2">
                            6. Công nghệ sử dụng
                        </h3>
                        <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                            <li>Frontend: Next.js hoặc React + Tailwind</li>
                            <li>Backend: Node.js / NestJS</li>
                            <li>Database: PostgreSQL + Prisma</li>
                            <li>Storage: AWS S3 hoặc Firebase Storage</li>
                            <li>
                                AI: Grok API, OpenAI, Claude, Gemini (hoặc chỉ
                                chọn 1 model)
                            </li>
                            <li>
                                Video recording: MediaRecorder + upload chunked
                                để tránh quá tải
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReadmePage;
